class Schedule
  attr_reader :schedule, :breakpoints

  def initialize(start_time, end_time, activities: [], events: [])
    @end = Event.create("End", start_time: end_time, system: true)
    @start = Event.create("Start", start_time: start_time, system: true)
    @preferred_times = TimeInterval.new(start_time, end_time)
    @breakpoints = {}

    activities.each do |activity| 
      events.append(
        Event.create(
          activity.title, 
          start_time: activity.start_time, 
          duration: activity.duration,
          activity_id: activity.id
        )
      )
    end

    fixed_events, nonfixed_events = events.partition{ |event| event.start_time.present? }
    
    @schedule = ([@start, @end] + fixed_events).sort_by(&:start_time)

    nonfixed_events.each { |event| add_nonfixed_event(event) }
  end

  def add_activity(activity)
    event = Event.create(
      activity.title, 
      start_time: activity.start_time, 
      duration: activity.duration,
      activity_id: activity.id
    )

    if activity.repeat
      add_repeated_event(event, activity.repeat)
    elsif event.fixed
      add_fixed_event(event)
    else
      add_nonfixed_event(event)
    end
  end

  private

  def add_system_event(title, time)
    event = Event.create(title, start_time: time, system: true)
    if event.before(@start)
      @schedule = [event] + @schedule
      return
    elsif @end.before(event)
      @schedule = @schedule + [event]
      return
    end

    index = find_place(event)
    @schedule.insert(index, event)
  end

  def add_fixed_event(event)
    if event.before(@start)
      @schedule = [event] + @schedule
      return
    elsif @end.before(event)
      @schedule = @schedule + [event]
      return
    end

    index = find_place(event)
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
      add_nonfixed_event(event.dup, time_interval)
    end

  end

  def add_nonfixed_event(event, time_interval = @preferred_times)
    possible_indexes = @schedule.each_index.select do |index| 
      @schedule[index].in_time_interval(time_interval)
    end

    # dropping the first index, as it is the last event before the current
    possible_indexes.drop(1).each do |index|
      previous_event = @schedule[index - 1]
      next_event = @schedule[index]

      # if there is empty space
      if previous_event.difference(next_event) >= event.duration
        event.set_time(previous_event.end_time)
        @schedule.insert(index, event)
        return
      end
    end

    fixed_events = @schedule.select do |event| 
      event.fixed && event.in_time_interval(time_interval)
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
    raise ArgumentError, "There is no space for this event"
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
      raise ArgumentError, "There is already other event at the same time"
    end

    reschedule = []

    # removing overlapping events
    for _ in 1 .. delete_events
      reschedule.append(@schedule[index])
      @schedule.delete_at(index)
    end

    # inserting the event at possition
    @schedule.insert(index, event)

    # rescheduling the removed events if possible
    reschedule.each do |event| 
      event.set_time(nil)
      begin
        add_nonfixed_event(event, time_interval)
      rescue
        next
      end
    end
  end

  # used only for fixed events, where binary search by time is possible
  def find_place(event, start_index = 0, end_index = @schedule.length) 
    index = (start_index + end_index) / 2

    current_event = @schedule[index]

    # if the event is after the current
    if current_event.before(event) 
      next_event = @schedule[index + 1]
      if next_event.before(event)
        return find_place(event, index + 1, end_index)
      else
        # if the event should be placed in the position after the current
        return index + 1
      end
    else
      # if the event is before the current
      previous_event = @schedule[index - 1]
      if previous_event.before(event)
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

    breakpoint_times.each do |time|
      add_system_event("Breakpoint", time.str)
    end

    @breakpoints[number_of_parts] = breakpoint_times
  end
end