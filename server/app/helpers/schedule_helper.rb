module ScheduleHelper 
  def self.add(user, activity)
    if activity.days.present?
      activity.days.each do |day|
        load_schedule(user, day, nil, activity)
      end
    elsif activity.date.present?
      load_schedule(user, nil, activity.date, activity)
    else
      raise ArgumentError, "Activity must have either days or a date"
    end

    activity.save
  end

  def self.add_shared(users, activity)
    if activity.days.present?
      activity.days.each do |day|
        load_shared_schedule(users, day, nil, activity)
      end
    elsif activity.date.present?
      load_shared_schedule(users, nil, activity.date, activity)
    else
      raise ArgumentError, "Activity must have either days or a date"
    end

    activity.save
  end

  private

  def self.load_schedule(user, day, date, activity)
    schedule_day = day || date&.wday
    is_weekend = schedule_day > 4

    day_start_time = is_weekend ? user.weekend_start_time : user.start_time
    day_end_time = is_weekend ? user.weekend_end_time : user.end_time

    events = Event.where(user_id: user.id, day: schedule_day).to_a + (
      if date.present? then Event.where(user_id: user.id, date: date).to_a else [] end)
    schedule = Schedule.new(day_start_time, day_end_time, day, date, events: events)

    schedule.add_activity(activity)
    
    schedule.schedule.each { |event| event.save }
  end

  def self.load_shared_schedule(users, day, date, activity)
    schedule_day = day || date&.wday
    is_weekend = schedule_day > 4

    schedules = users.map do |user|
      day_start_time = is_weekend ? user.weekend_start_time : user.start_time
      day_end_time = is_weekend ? user.weekend_end_time : user.end_time

      events = Event.where(user_id: user.id, day: schedule_day).to_a + (
        if date.present? then Event.where(user_id: user.id, date: date).to_a else [] end)
      puts events
      puts '....'

      Schedule.new(day_start_time, day_end_time, day, date, events: events)
    end

    shared_schedule = SharedSchedule.new(schedules, day: day, date: date)

    shared_schedule.add_shared_activity(activity)
    
    schedules.each do |schedule| 
      schedule.schedule.each { |event| event.save }
    end
  end
end
