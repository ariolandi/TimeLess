class Schedule
  attr_reader :schedule, :breakpoints

  def initialize(start_time, end_time, activities: [], events: [])
    @end = Event.create("End", start_time: end_time, system: true)
    @start = Event.create("Start", start_time: start_time, system: true)
    @schedule = [@start, @end]
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

    fixed_events, nonfixed_events = events.partition{ |event| event.fixed }
    fixed_events.each { |event| add_fixed_event(event) }
    nonfixed_events.each { |event| add_nonfixed_event(event) }
  end

  def add_activity(activity)
    event = Event.create(
      activity.title, 
      start_time: activity.start_time, 
      duration: activity.duration,
      activity_id: activity.id
    )

    event.fixed? ? add_fixed_event(event) : add_nonfixed_event(event)
  end

  private

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

  def add_nonfixed_event(event)
    index = 1

    while index < @schedule.length
      previous_event = @schedule[index - 1]
      next_event = @schedule[index]

      # if there is empty space
      if previous_event.difference(next_event) >= event.duration
        event.set_time(previous_event.end_time)
        @schedule.insert(index, event)
        return
      end

      index += 1
    end

    fixed_events = @schedule.select { |event| event.fixed }

    # trying to find a place between the fixed events 
    for i in 1..fixed_events.length - 1 do
      previous_event = fixed_events[i - 1]
      next_event = fixed_events[i]

      if previous_event.difference(next_event) >= event.duration
        schedule_index_previous = @schedule.find_index(previous_event)
        begin
          index = schedule_index_previous + 1
          event.set_time(previous_event.end_time)
          reorganize_schedule(event, index)
          return
        rescue
          next
        end
      end
    end

    # if there is not empty space
    raise ArgumentError, "There is no space for this event"
  end

  def reorganize_schedule(event, index)
    next_event = @schedule[index]
    next_index = index
    delete_events = 0

    # if there are any non-fixed events in the same slot
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

    for i in 1 .. delete_events
      reschedule.append(@schedule[index])
      @schedule.delete_at(index)
    end

    @schedule.insert(index, event)

    reschedule.each do |event| 
      event.set_time(nil)
      begin
        add_nonfixed_event(event)
      rescue
        next
      end
    end
  end

  def find_place(event, start_index = 0, end_index = @schedule.length) 
    # binary search
    index = (start_index + end_index) / 2

    current_event = @schedule[index]

    if current_event.before(event) 
      next_event = @schedule[index + 1]
      if next_event.before(event)
        return find_place(event, index + 1, end_index)
      else
        # if this is the last event before the current
        return index + 1
      end
    else
      previous_event = @schedule[index - 1]
      if previous_event.before(event)
        # if this is the first event after the current
        return index
      else
        return find_place(event, start_index, index)
      end
    end
  end

  def create_breakpoint(number_of_parts)
    # if the same breakpoint is present
    return if @breakpoints.keys.include?(number_of_parts)

    day_duration = TimeService.duration(@start.start_time, @end.start_time).to_minutes
    partition_duration = day_duration / number_of_parts

    breakpoint_times = (1..number_of_parts - 1).to_a.map do |part_number| 
      TimeService.new(@start.start_time) + (part_number * partition_duration)
    end

    @breakpoints[number_of_parts] =  breakpoint_times.map do |breakpoint_time| 
      Event.create(
        "breakpoint", 
        start_time: breakpoint_time.str, 
        system: true
      )
    end
  end
end