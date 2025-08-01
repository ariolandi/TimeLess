class Event < ApplicationRecord
  belongs_to :activity, optional: true

  def self.create(activity: nil, start_time: nil, day: nil, fixed: nil, event_type: nil, user_id: nil)
    fixed ||= activity&.start_time.present? || event_type.present?
    start_time = activity&.start_time.presence || start_time

    params = {
      user_id: user_id || activity&.user_id,
      activity: activity,
      start_time: start_time.present? ? TimeService.new(start_time).to_datetime : nil,
      event_type: event_type,
      fixed: fixed,
      day: day
    }

    Event.new(params)
  end

  def copy
    params = {
      user_id: user_id,
      activity: activity,
      start_time: start_time&.duplicate,
      event_type: event_type,
      fixed: fixed,
      day: day
    }

    Event.new(params)
  end

  def represent
    {
      user_id: user_id,
      activity_id: activity&.id,
      title: activity&.title,
      start_time: TimeService.new(start_time || activity&.start_time).str,
      duration: activity&.duration,
      end_time:  TimeService.new(end_time || "").str,
      fixed: fixed,
      event_type: event_type || ""
    }
  end

  def end_time
    TimeService.new(self.start_time) + TimeService.new(activity&.duration)
  end

  def duration
    TimeService.new(activity&.duration).to_minutes
  end

  def set_time(start_time)
    self.start_time = start_time.to_datetime
  end

  def before(other)
    self.start_time.present? && self.end_time <= (other.is_a?(Event) ? other.start_time : other)
  end

  def after(other)
    self.start_time.present? && (other.is_a?(Event) ? other.end : other) <= self.start_time
  end

  def difference(other)
    TimeService::duration(self.end_time, other.start_time).to_minutes
  end

  def in_time_interval(time_interval)
    time_interval.is_subinterval(TimeInterval.new(start_time, end_time))
  end
end
