class Schedule
  attr_reader :schedule, :breakpoints, :preferred_times

  def initialize(start_time, end_time, day, activities: [], events: [])
    @day = day
    @preferred_times = TimeInterval.new(start_time, end_time)

    activities.each do |activity| 
      events.append(Event.create(activity: activity, day: @day))
    end

    fixed_events, nonfixed_events = events.partition{ |event| event.start_time.present? }

    @schedule = fixed_events.sort_by(&:start_time)
    
    load_breakpoint(fixed_events)

    nonfixed_events.each { |event| add_nonfixed_event(event) }
  end

  def add_activity(activity)
    event = Event.create(activity: activity, day: @day)

    if activity.repeat && activity.repeat != 0
      add_repeated_event(event, activity.repeat)
    elsif event.fixed
      add_fixed_event(event)
    else
      add_nonfixed_event(event)
    end
  end

  def remove_activity(activity)
    @schedule.keep_if{ |event| event.activity_id != activity.id }
  end

  private

  def add_fixed_event(event)
    if event.before(@preferred_times.start_time)
      @schedule = [event] + @schedule
      return
    elsif event.after(@preferred_times.end_time)
      @schedule = @schedule + [event]
      return
    end

    index = find_place(event)

    if event.event_type.present?
      @schedule.insert(index, event)
      return
    end

    reorganize_schedule(event, index)
  end

  def add_repeated_event(event, repeat_times)
    create_breakpoint(repeat_times)
    breakpoint_times = breakpoints[repeat_times]

    intervals = [TimeInterval.new(@preferred_times.start_time, breakpoint_times.first)]
    previous_time = breakpoint_times.first

    breakpoint_times.drop(1).each do |time|
      intervals.append(TimeInterval.new(previous_time, time))
      previous_time = time
    end

    intervals.append(TimeInterval.new(previous_time, @preferred_times.end_time))

    intervals.each do |time_interval|
      add_nonfixed_event(event.copy, time_interval)
    end
  end

  def add_nonfixed_event(event, time_interval = @preferred_times)
    possible_indexes = (0..@schedule.length).select do |index| 
      element = @schedule[index]
      element ? element.in_time_interval(time_interval) : true
    end

    possible_indexes.each do |index|
      # maximum ending time for the index
      ending_time = @schedule[index]&.start_time
      ending_time = time_interval.end_time if ending_time.nil? || time_interval.end_time < ending_time

      # starting time for the index
      starting_time = index == 0 ? time_interval.start_time : @schedule[index - 1].end_time
      starting_time = time_interval.start_time if time_interval.start_time > starting_time

      if TimeService.duration(starting_time, ending_time).to_minutes >= event.duration
        event.set_time(starting_time)
        @schedule.insert(index, event)
        return
      end
    end

    fixed_events = @schedule.select do |event| 
      event.fixed && event.event_type.nil? && event.in_time_interval(time_interval)
    end

    # trying to find a place between the fixed events 
    for i in 1..fixed_events.length - 1 do
      previous_event = fixed_events[i - 1]
      next_event = fixed_events[i]

      # if there is enough space 
      if previous_event.difference(next_event) >= event.duration
        schedule_index_previous = @schedule.find_index(previous_event)
        begin
          # trying to insert the event
          index = schedule_index_previous + 1
          event.set_time(previous_event.end_time)
          reorganize_schedule(event, index, time_interval)
          return
        rescue
          # in case of failure, continue searching for a place
          next
        end
      end
    end

    # if there is not empty space
    raise ArgumentError, "There is no space for this event: #{event.represent}"
  end

  def reorganize_schedule(event, index, time_interval = @preferred_times)
    next_event = @schedule[index]
    next_index = index
    delete_events = 0

    # if there are any non-fixed events in the same slot, 
    # they are marked for rescheduling
    while next_event.present? && 
          !next_event.fixed && 
          next_event.start_time <= event.end_time &&
          (event.fixed || next_event.duration < event.duration)
      delete_events += 1
      next_index = next_index + 1
      next_event = next_index == @schedule.length ? nil : @schedule[next_index]
    end

    # if there is a fixed event in the same slot
    if next_event.present? && next_event.fixed && next_event.start_time <= event.end_time
      raise ArgumentError, "There is already other event at the same time: #{event.represent}"
    end

    reschedule = []

    # removing overlapping events
    for _ in 1 .. delete_events
      reschedule.append(@schedule[index])
      @schedule.delete_at(index)
    end

    # inserting the event at position
    @schedule.insert(index, event)

    # rescheduling the removed events if possible
    reschedule.each do |event| 
      begin
        add_nonfixed_event(event, time_interval)
      rescue
        next
      end
    end
  end

  # used only for fixed events, where binary search by time is possible
  def find_place(event, start_index = 0, end_index = @schedule.length) 
    return start_index if start_index == end_index

    index = (start_index + end_index) / 2

    current_event = @schedule[index]

    # if the event is after the current
    if current_event.nil? || current_event.before(event) 
      next_event = index == end_index ? nil : @schedule[index + 1]
      if next_event.present? && next_event.before(event)
        return find_place(event, index + 1, end_index)
      else
        # if the event should be placed in the position after the current
        return index + 1
      end
    else
      # if the event is before the current
      previous_event = index == 0 ? nil : @schedule[index - 1]

      if previous_event.nil? || previous_event.before(event)
        # if the event should be placed in the position before the current
        return index
      else
        return find_place(event, start_index, index)
      end
    end
  end

  def create_breakpoint(number_of_parts)
    # if the same breakpoint is present
    return if @breakpoints.keys.include?(number_of_parts)

    day_duration = @preferred_times.duration.to_minutes
    partition_duration = day_duration / number_of_parts

    breakpoint_times = (1..number_of_parts - 1).to_a.map do |part_number| 
      @preferred_times.start_time + (part_number * partition_duration)
    end

    # adding the system events
    breakpoint_times.each do |time|
      event = Event.create(start_time: time, event_type: "breakpoint #{number_of_parts}", day: @day)
      add_fixed_event(event)
    end

    @breakpoints[number_of_parts] = breakpoint_times
  end

  def load_breakpoint(events)
    breakpoints_events = events.select { |event| event.event_type.present? && event.event_type =~ /^breakpoint /}

    @breakpoints = {}

    breakpoints_events.each do |event|
      _, number_of_parts = event.event_type.split(' ')

      @breakpoints[number_of_parts] = [] unless @breakpoints.keys.include?(number_of_parts)
      @breakpoints[number_of_parts].append(event.start_time)
    end
  end
end