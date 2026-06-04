class SharedSchedule < Schedule
  def initialize(schedules, day: nil, date: nil)
    @schedules = schedules
  
    start_time = SharedSchedule::get_start_time(@schedules)
    end_time = SharedSchedule::get_end_time(@schedules)

    super(start_time, end_time, day, date)

    fixed_events = @schedules.map { |schedule| schedule.schedule.select(&:fixed?) }.flatten.sort_by(&:start_time)

    merged_fixed_events = []
    last_event = fixed_events&.first

    fixed_events.drop(1).each do |event|
      if last_event.overlaps?(event)
        last_event = last_event.merge(event)
      else
        merged_fixed_events << last_event
        last_event = event
      end
    end
    merged_fixed_events << last_event if last_event

    merged_fixed_events.each do |event|
      add_fixed_event(event)
    end
  end

  def add_shared_activity(activity)
    begin
      event = add_activity(activity)

      event.fixed = true
      puts event.represent
      @schedules.each do |schedule| 
        puts schedule.inspect
        schedule.add_fixed_event(event) 
      end
    rescue 
      raise ArgumentError, "Activity cannot be added to all schedules"
    end
  end

  private

  def self.get_start_time(schedules)
    start_time = schedules&.first&.preferred_times&.start_time

    schedules&.drop(1)&.each do |schedule|
      start_time = TimeService.max(start_time, schedule.preferred_times.start_time)
    end

    start_time
  end

  def self.get_end_time(schedules)
    end_time = schedules&.first&.preferred_times&.end_time

    schedules&.drop(1)&.each do |schedule|
      end_time = TimeService.min(end_time, schedule.preferred_times.end_time)
    end

    end_time
  end
end