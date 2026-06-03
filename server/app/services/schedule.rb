class Schedule
  attr_reader :schedule, :breakpoints, :preferred_times

  def initialize(start_time, end_time, day, activities: [], events: [])
    @day = day
    @preferred_times = TimeInterval.new(start_time, end_time)

    activities.each do |activity|
      events << Event.create(activity: activity, day: @day)
    end

    fixed_events, nonfixed_events = events.partition { |event| event.start_time.present? }

    @schedule = fixed_events.sort_by(&:start_time)

    load_breakpoint(fixed_events)

    nonfixed_events.each { |event| add_nonfixed_event(event) }
  end

  def add_activity(activity)
    event = Event.create(activity: activity, day: @day)

    # repeated activity
    if activity.repeat && activity.repeat > 1
      add_repeated_event(event, activity.repeat)
    # fixed activity
    elsif event.fixed
      add_fixed_event(event)
    # non-fixed activity
    else
      add_nonfixed_event(event)
    end

    event
  end

  def remove_activity(activity)
    @schedule.keep_if{ |event| event.activity_id != activity.id }
  end

  protected
  
  # Detects the free time intervals in the schedule
  def free_time_intervals(time_interval = @preferred_times, fixed = false)
    return [time_interval] if @schedule.empty?

    intervals = []
    previous_time = time_interval.start_time

    @schedule.each do |event|
      if (!fixed || event.fixed) 
        if event.start_time > previous_time && event.in_time_interval(time_interval)
          intervals << TimeInterval.new(previous_time, event.start_time)
        end

        previous_time = TimeService.max(previous_time, event.end_time)
      end
    end

    if previous_time < time_interval.end_time
      intervals << TimeInterval.new(previous_time, time_interval.end_time)
    end

    intervals
  end

  def add_fixed_event(event)
    return @schedule.unshift(event) if event.before(@preferred_times.start_time) || @schedule.empty?
    return @schedule.push(event) if event.after(@preferred_times.end_time)

    index = find_place(event)

    if index.nil? || (@schedule[index - 1] && event.before(@schedule[index - 1].end_time))
      raise ArgumentError, "There is already other event at the same time: #{event.represent}"
    end

    return @schedule.insert(index, event) if event.event_type.present?

    reorganize_schedule(event, index)
  end

  private

  def add_repeated_event(event, repeat_times)
    create_breakpoint(repeat_times)
    breakpoint_times = breakpoints[repeat_times]

    intervals = [TimeInterval.new(@preferred_times.start_time, breakpoint_times.first)]
    previous_time = breakpoint_times.first

    # the first breakpoint is the start of the day and already assigned to previous_time
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
    return if insert_into_available_slot(event, time_interval)

    fixed_events = fixed_events_in_interval(time_interval)

    fixed_events.each_cons(2) do |previous_event, next_event|
      next unless previous_event.difference(next_event) >= event.duration

      schedule_index_previous = @schedule.find_index(previous_event)
      index = schedule_index_previous + 1
      event.set_time(previous_event.end_time)
      reorganize_schedule(event, index, time_interval)
      return
    rescue ArgumentError
      next
    end

    raise ArgumentError, "There is no space for this event: #{event.represent}"
  end

  def insert_into_available_slot(event, time_interval)
    possible_time_intervals = free_time_intervals(time_interval)

    for i in 0...possible_time_intervals.length
      if event.duration <= possible_time_intervals[i].duration
        index = @schedule.find_index { |e| possible_time_intervals[i].end_time <= e.start_time} || @schedule.length 
        
        starting_time = if index.zero?
            time_interval.start_time
          else
            TimeService.max(@schedule[index - 1].end_time, time_interval.start_time)
          end

        event.set_time(starting_time)
        return @schedule.insert(index, event)
      end
    end

    false
  end

  def possible_indexes(time_interval)
    (0..@schedule.length).select do |index|
      element = @schedule[index]
      element.nil? || element.in_time_interval(time_interval)
    end
  end

  def fixed_events_in_interval(time_interval)
    @schedule.select do |event|
      event.fixed && event.event_type.nil? && event.in_time_interval(time_interval)
    end
  end

  def reorganize_schedule(event, index, time_interval = @preferred_times)
    next_index = index
    next_event = @schedule[next_index]
    reschedule = []

    while next_event.present? && !next_event.fixed && next_event.start_time <= event.end_time &&
          (event.fixed || next_event.duration < event.duration)
      reschedule << next_event
      next_index += 1
      next_event = next_index == @schedule.length ? nil : @schedule[next_index]
    end

    if next_event.present? && next_event.fixed && next_event.start_time <= event.end_time
      raise ArgumentError, "There is already other event at the same time: #{event.represent}"
    end

    reschedule.each { @schedule.delete_at(index) }
    @schedule.insert(index, event)

    reschedule.each do |rescheduled_event|
      add_nonfixed_event(rescheduled_event, time_interval)
    rescue ArgumentError
      next
    end
  end

  def find_place(event)
    intervals = free_time_intervals(@preferred_times, true)

    index = @schedule.length 
    for i in 0...intervals.length
      index = @schedule.find_index { |e| intervals[i].end_time <= e.start_time} || @schedule.length if intervals[i].duration >= event.duration && event.in_time_interval(intervals[i])
    end

    index
  end

  def create_breakpoint(number_of_parts)
    return if @breakpoints.key?(number_of_parts)

    day_duration = @preferred_times.duration
    partition_duration = day_duration / number_of_parts

    breakpoint_times = (1...number_of_parts).map do |part_number|
      @preferred_times.start_time + (part_number * partition_duration)
    end

    breakpoint_times.each do |time|
      event = Event.create(start_time: time, event_type: "breakpoint #{number_of_parts}", day: @day)
      add_fixed_event(event)
    end

    @breakpoints[number_of_parts] = breakpoint_times
  end

  def load_breakpoint(events)
    @breakpoints = {}

    events.each do |event|
      next unless event.event_type.present?

      match = event.event_type.match(/^breakpoint (\d+)$/)
      next unless match

      number_of_parts = match[1].to_i
      @breakpoints[number_of_parts] ||= []
      @breakpoints[number_of_parts] << event.start_time
    end
  end
end