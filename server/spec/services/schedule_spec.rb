require "rails_helper"

# Activities are described in format:
#  user_id | activity_id | title | start_time | duration
# Events are described in format:
#  activity_id | title | start_time | duration | fixed | system

RSpec.describe Schedule do
  it "creates successfully" do
    start_time = "09:00"
    end_time = "18:00"
    empty_schedule = Schedule.new(start_time, end_time)

    expect(empty_schedule.instance_variable_get(:@start).start_time.to_fs(:time)).to eq(start_time)
    expect(empty_schedule.instance_variable_get(:@end).start_time.to_fs(:time)).to eq(end_time)
  end

  context "handles bad timing" do
    it "with strings" do
      expect { Schedule.new("asdf", "18:00") }.to raise_error(ArgumentError)
    end

    it "with integer" do
      expect { Schedule.new(9, "18:00") }.to raise_error(TypeError)
    end
  end

  context "without any activities" do
    it "creates system events" do
      start_event = setup_event(" | Start | 09:00 | 00:00 | true | true")
      end_event = setup_event(" | End | 18:00 | 00:00 | true | true")

      empty_schedule = Schedule.new("09:00", "18:00")

      expect_equal(empty_schedule, [start_event, end_event])
    end

    it "adds fixed activity correctly" do
      activity = setup_activity("1 | 1 | fixed activity | 10:00 | 00:10")

      expected_schedule = setup_events <<~EVENTS
          | Start          | 09:00 | 00:00 | true  | true
        1 | fixed activity | 10:00 | 00:10 | true  | false
          | End            | 18:00 | 00:00 | true  | true
      EVENTS

      empty_schedule = Schedule.new("09:00", "18:00")
      empty_schedule.add_activity(activity)

      expect_equal(empty_schedule, expected_schedule)
    end
  
    it "adds fixed activity after ending hour" do
      activity = setup_activity("1 | 1 | fixed activity | 19:00 | 00:10")

      expected_schedule = setup_events <<~EVENTS
          | Start          | 09:00 | 00:00 | true  | true
          | End            | 18:00 | 00:00 | true  | true
        1 | fixed activity | 19:00 | 00:10 | true  | false
      EVENTS

      empty_schedule = Schedule.new("09:00", "18:00")
      empty_schedule.add_activity(activity)

      expect_equal(empty_schedule, expected_schedule)
    end

    it "adds fixed activity before starting hour" do
      activity = setup_activity("1 | 1 | fixed activity | 08:00 | 00:10")

      expected_schedule = setup_events <<~EVENTS
        1 | fixed activity | 08:00 | 00:10 | true  | false
          | Start          | 09:00 | 00:00 | true  | true
          | End            | 18:00 | 00:00 | true  | true
      EVENTS

      empty_schedule = Schedule.new("09:00", "18:00")
      empty_schedule.add_activity(activity)

      expect_equal(empty_schedule, expected_schedule)
    end
  end

  context "with fixed activities" do
    it "creates events for the activities" do
      activities = setup_activities <<~ACTIVITIES
        1 | 1 | fixed activity 1 | 16:00 | 01:00
        1 | 2 | fixed activity 2 | 10:00 | 00:30
      ACTIVITIES

      expected_events = setup_events <<~EVENTS
        2 | fixed activity 2  | 10:00 | 00:30 | true  | false
        1 | fixed activity 1  | 16:00 | 01:00 | true  | false
      EVENTS
  
      schedule = Schedule.new("09:00", "18:00", activities: activities)

      expected_events.each do |expected_event|
        expect(schedule.schedule.map(&:attributes)).to include(expected_event.attributes)
      end
    end

    it "calculates the schedule correctly" do
      activities = setup_activities <<~ACTIVITIES
        1 | 1 | fixed activity 1 | 16:00 | 01:00
        1 | 2 | fixed activity 2 | 10:00 | 00:30
      ACTIVITIES
  
      expected_schedule = setup_events <<~EVENTS
          | Start             | 09:00 | 00:00 | true | true
        2 | fixed activity 2  | 10:00 | 00:30 | true | false
        1 | fixed activity 1  | 16:00 | 01:00 | true | false
          | End               | 18:00 | 00:00 | true | true
      EVENTS

      schedule = Schedule.new("09:00", "18:00", activities: activities)

      expect_equal(schedule, expected_schedule)
    end

    it "throws error for time duplications" do
      activities = setup_activities <<~ACTIVITIES
        1 | 1 | fixed activity 1 | 16:00 | 01:00
        1 | 2 | fixed activity 2 | 10:00 | 00:30
      ACTIVITIES

      schedule = Schedule.new("09:00", "18:00", activities: activities)
      
      activity = setup_activity("1 | 3 | duplicate activity | 10:00 | 00:10")

      expect { schedule.add_activity(activity) }.to raise_error(ArgumentError)
    end

    it "throws error when there is no free slot" do
      activities = setup_activities <<~ACTIVITIES
        1 | 1 | fixed activity 1 | 16:00 | 01:00
        1 | 2 | fixed activity 2 | 10:00 | 00:30
      ACTIVITIES

      schedule = Schedule.new("09:00", "18:00", activities: activities)
      
      activity = setup_activity("1 | 3 | activity | 16:30 | 00:10")

      expect { schedule.add_activity(activity) }.to raise_error(ArgumentError)
    end
  end

  context "with nonfixed activities" do
    context "handles nonfixed events" do
      context "adds successfully" do
        it "when there is enough space" do
          activities = setup_activities <<~ACTIVITIES
            1 | 1 | fixed activity 1 | 10:00 | 00:30
            1 | 2 | fixed activity 2 | 12:00 | 00:45
            1 | 3 | fixed activity 3 | 16:00 | 01:00
          ACTIVITIES
  
          activity = setup_activity("1 | 4 | nonfixed activity | | 01:30")

          expected_schedule = setup_events <<~EVENTS
              | Start             | 09:00 | 00:00 | true  | true
            1 | fixed activity 1  | 10:00 | 00:30 | true  | false
            4 | nonfixed activity | 10:30 | 01:30 | false | false
            2 | fixed activity 2  | 12:00 | 00:45 | true  | false
            3 | fixed activity 3  | 16:00 | 01:00 | true  | false
              | End               | 18:00 | 00:00 | true  | true
          EVENTS

          schedule = Schedule.new("09:00", "18:00", activities: activities)
          schedule.add_activity(activity)

          expect_equal(schedule, expected_schedule)
        end

        it "when there are fixed events outside preferred time" do
          activities = setup_activities <<~ACTIVITIES
            1 | 1 | fixed activity 1 | 10:00 | 00:30
            1 | 2 | fixed activity 2 | 12:00 | 00:45
            1 | 3 | fixed activity 3 | 16:00 | 01:00
            1 | 4 | fixed activity 4 | 08:00 | 00:10
            1 | 5 | fixed activity 5 | 19:00 | 00:30
          ACTIVITIES

          activity = setup_activity("1 | 6 | nonfixed activity | | 00:30")
  
          expected_schedule = setup_events <<~EVENTS
            4 | fixed activity 4  | 08:00 | 00:10 | true  | false
              | Start             | 09:00 | 00:00 | true  | true
            6 | nonfixed activity | 09:00 | 00:30 | false | false
            1 | fixed activity 1  | 10:00 | 00:30 | true  | false
            2 | fixed activity 2  | 12:00 | 00:45 | true  | false
            3 | fixed activity 3  | 16:00 | 01:00 | true  | false
              | End               | 18:00 | 00:00 | true  | true
            5 | fixed activity 5  | 19:00 | 00:30 | true  | false
          EVENTS

          schedule = Schedule.new("09:00", "18:00", activities: activities)
          schedule.add_activity(activity)

          expect_equal(schedule, expected_schedule)
        end
      end

      it "raises error when there is not enough space" do
        activities = setup_activities <<~ACTIVITIES
          1 | 1 | fixed activity 1 | 10:00 | 00:30
          1 | 2 | fixed activity 2 | 12:00 | 00:45
          1 | 3 | fixed activity 3 | 16:00 | 01:00
          1 | 4 | fixed activity 4 | 08:00 | 00:10
          1 | 5 | fixed activity 5 | 19:00 | 00:30
        ACTIVITIES

        activity = setup_activity("1 | 4 | nonfixed activity | | 04:30")

        schedule = Schedule.new("09:00", "18:00", activities: activities)

        expect { schedule.add_activity(activity) }.to raise_error(ArgumentError)
      end

      it "reschedule if there is need" do
        activities = setup_activities <<~ACTIVITIES
          1 | 1 | fixed activity 1    | 10:00 | 00:30 
          1 | 2 | fixed activity 2    | 12:00 | 00:45 
          1 | 3 | fixed activity 3    | 16:00 | 01:00
          1 | 4 | nonfixed activity 1 |       | 00:30
          1 | 5 | nonfixed activity 2 |       | 01:00
          1 | 6 | nonfixed activity 3 |       | 01:00
        ACTIVITIES

        rescheduling_activity = setup_activity("1 | 7 | nonfixed activity 4 | | 02:30")

        expected_schedule_1 = setup_events <<~EVENTS
            | Start               | 09:00 | 00:00 | true  | true
          4 | nonfixed activity 1 | 09:00 | 00:30 | false | false
          1 | fixed activity 1    | 10:00 | 00:30 | true  | false
          5 | nonfixed activity 2 | 10:30 | 01:00 | false | false
          2 | fixed activity 2    | 12:00 | 00:45 | true  | false
          6 | nonfixed activity 3 | 12:45 | 01:00 | false | false
          3 | fixed activity 3    | 16:00 | 01:00 | true  | false
            | End                 | 18:00 | 00:00 | true  | true
        EVENTS

        schedule = Schedule.new("09:00", "18:00", activities: activities)

        expect_equal(schedule, expected_schedule_1)

        expected_schedule_2 = setup_events <<~EVENTS
            | Start               | 09:00 | 00:00 | true  | true
          4 | nonfixed activity 1 | 09:00 | 00:30 | false | false
          1 | fixed activity 1    | 10:00 | 00:30 | true  | false
          5 | nonfixed activity 2 | 10:30 | 01:00 | false | false
          2 | fixed activity 2    | 12:00 | 00:45 | true  | false
          7 | nonfixed activity 4 | 12:45 | 02:30 | false | false
          3 | fixed activity 3    | 16:00 | 01:00 | true  | false
          6 | nonfixed activity 3 | 17:00 | 01:00 | false | false
            | End                 | 18:00 | 00:00 | true  | true
        EVENTS

        schedule.add_activity(rescheduling_activity)

        expect_equal(schedule, expected_schedule_2)
      end
    end
  end

  context "with repeating activities" do
    context "creates breakpoints" do
      it "for two parts" do
        empty_schedule = Schedule.new("09:00", "18:00")
        empty_schedule.send(:create_breakpoint, 2)

        breakpoints = empty_schedule.breakpoints[2].map { |breakpoint| breakpoint.start_time.to_fs(:time) }
        expect(breakpoints).to eq(["13:30"])
      end

      it "for three parts" do
        empty_schedule = Schedule.new("09:00", "18:00")
        empty_schedule.send(:create_breakpoint, 3)

        breakpoints = empty_schedule.breakpoints[3].map { |breakpoint| breakpoint.start_time.to_fs(:time) }
        expect(breakpoints).to eq(["12:00", "15:00"])
      end
    end
  end

  private

  def expect_equal(schedule, expected_schedule)
    expected_schedule.map!(&:attributes)
    expect(schedule.schedule.map(&:attributes)).to eq(expected_schedule)
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
    user_id, activity_id, title, start_time, duration = activity.split('|').map(&:strip)
      
    Activity.new({
      id: activity_id,
      user_id: user_id, 
      title: title, 
      start_time: start_time,
      duration: duration,
    })
  end

  def setup_event(event)
    activity_id, title, start_time, duration, fixed, system = event.split('|').map(&:strip)  

    Event.create(
      title,
      start_time: start_time,
      duration: duration,
      activity_id: activity_id,
      fixed: fixed.to_b,
      system: system.to_b
    )
  end
end