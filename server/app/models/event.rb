class Event < ApplicationRecord
    def self.create(title, start_time: nil, duration: nil, activity_id: nil, system: false, fixed: nil)
        start_time = TimeService.new(start_time) if start_time.present?
        duration = TimeService.new(duration)
        end_time = start_time.present? ? start_time + duration : nil

        if fixed.nil?
            fixed = start_time.present?
        end
        
        params = {
            title: title,
            start_time: start_time&.to_datetime,
            duration: duration.to_minutes,
            end_time: end_time&.to_datetime,
            activity_id: activity_id,
            fixed: fixed,
            system: system,
        }

        Event.new(params)
    end

    def set_time(start_time)
        self.start_time = start_time
        self.end_time = start_time.nil? ?
            nil :
            (TimeService.new(start_time) + self.duration).to_datetime
    end

    def before(other)
        self.start_time.present? && self.end_time <= other.start_time
    end

    def difference(other)
        TimeService::duration(self.end_time, other.start_time).to_minutes
    end
end
