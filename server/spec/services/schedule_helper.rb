  module ScheduleSpecHelper
    def expect_equal(schedule, expected_schedule)
      expect(schedule.schedule.map(&:represent)).to eq(expected_schedule.map(&:represent))
    end

    def setup_activities(activities_info)
      activities_info.lines.map do |activity_info|
        setup_activity(activity_info)
      end
    end

    def setup_events(events_info)
      events_info.lines.map do |event_info|
        setup_event(event_info)
      end
    end

    def setup_activity(activity)
      activity_id, title, start_time, duration, repeat = activity.split('|').map(&:strip)

      Activity.new(
        id: activity_id,
        title: title,
        start_time: start_time,
        duration: duration,
        repeat: repeat
      )
    end

    def setup_event(event)
      activity_id, title, start_time, duration, fixed, event_type = event.split('|').map(&:strip)

      activity = activity_id.present? ? setup_activity("#{activity_id} | #{title} | | #{duration} | ") : nil

      Event.create(
        activity: activity,
        start_time: start_time,
        fixed: fixed.to_b,
        event_type: event_type
      )
    end
end