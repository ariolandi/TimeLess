module ScheduleHelper 
  def self.add(user, activity)
    activity.days.each do |day|
      is_weekend = day > 4

      day_start_time = is_weekend ? user.weekend_start_time : user.start_time
      day_end_time = is_weekend ? user.weekend_end_time : user.end_time

      events = Event.where(user_id: user.id, day: day).to_a
      schedule = Schedule.new(day_start_time, day_end_time, day, events: events)

      schedule.add_activity(activity)
      
      schedule.schedule.each { |event| event.save }
    end
  end
end
