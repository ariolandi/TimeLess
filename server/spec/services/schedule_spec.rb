require "rails_helper"

# Activities are described in format:
#  activity_id | title | start_time | duration | repeat
# Events are described in format:
#  activity_id | title | start_time | duration | fixed | system

RSpec.describe Schedule do
  it "creates successfully" do
    start_time = "09:00"
    end_time = "18:00"
    day = 1
    empty_schedule = Schedule.new(start_time, end_time, day)

    expect(empty_schedule.preferred_times.start_time.str).to eq(start_time)
    expect(empty_schedule.preferred_times.end_time.str).to eq(end_time)
  end

  context "handles bad timing" do
    it "with strings" do
      expect { Schedule.new("asdf", "18:00", 1) }.to raise_error(ArgumentError)
    end

    it "with integer" do
      expect { Schedule.new(9, "18:00", 1) }.to raise_error(TypeError)
    end
  end

  context "without any activities" do
    it "adds fixed activity correctly" do
      activity = setup_activity("1 | fixed activity | 10:00 | 00:10")

      expected_schedule = setup_events <<~EVENTS
        1 | fixed activity | 10:00 | 00:10 | true  |
      EVENTS

      empty_schedule = Schedule.new("09:00", "18:00", 1)
      empty_schedule.add_activity(activity)

      expect_equal(empty_schedule, expected_schedule)
    end
  
    it "adds fixed activity after ending hour" do
      activity = setup_activity("1 | fixed activity | 19:00 | 00:10")

      expected_schedule = setup_events <<~EVENTS
        1 | fixed activity | 19:00 | 00:10 | true  |
      EVENTS

      empty_schedule = Schedule.new("09:00", "18:00", 1)
      empty_schedule.add_activity(activity)

      expect_equal(empty_schedule, expected_schedule)
    end

    it "adds fixed activity before starting hour" do
      activity = setup_activity("1 | fixed activity | 08:00 | 00:10")

      expected_schedule = setup_events <<~EVENTS
        1 | fixed activity | 08:00 | 00:10 | true  |
      EVENTS

      empty_schedule = Schedule.new("09:00", "18:00", 1)
      empty_schedule.add_activity(activity)

      expect_equal(empty_schedule, expected_schedule)
    end

    it "adds nonfixed activity" do
      activity = setup_activity("1 | nonfixed activity | | 00:10")

      expected_schedule = setup_events <<~EVENTS
        1 | nonfixed activity | 09:00 | 00:10 | false  |
      EVENTS

      empty_schedule = Schedule.new("09:00", "18:00", 1)
      empty_schedule.add_activity(activity)

      expect_equal(empty_schedule, expected_schedule)
    end
  end

  context "with fixed activities" do
    it "creates events for the activities" do
      activities = setup_activities <<~ACTIVITIES
        1 | fixed activity 1 | 16:00 | 01:00
        2 | fixed activity 2 | 10:00 | 00:30
      ACTIVITIES

      expected_events = setup_events <<~EVENTS
        2 | fixed activity 2  | 10:00 | 00:30 | true  | 
        1 | fixed activity 1  | 16:00 | 01:00 | true  |
      EVENTS
  
      schedule = Schedule.new("09:00", "18:00", 1, activities: activities)

      expected_events.each do |expected_event|
        expect(schedule.schedule.map(&:represent)).to include(expected_event.represent)
      end
    end

    it "calculates the schedule correctly" do
      activities = setup_activities <<~ACTIVITIES
        1 | fixed activity 1 | 16:00 | 01:00
        2 | fixed activity 2 | 10:00 | 00:30
      ACTIVITIES
  
      expected_schedule = setup_events <<~EVENTS
        2 | fixed activity 2  | 10:00 | 00:30 | true |  
        1 | fixed activity 1  | 16:00 | 01:00 | true |  
      EVENTS

      schedule = Schedule.new("09:00", "18:00", 1, activities: activities)

      expect_equal(schedule, expected_schedule)
    end

    it "throws error for time duplications" do
      activities = setup_activities <<~ACTIVITIES
        1 | fixed activity 1 | 16:00 | 01:00
        2 | fixed activity 2 | 10:00 | 00:30
      ACTIVITIES

      activity = setup_activity("3 | duplicate activity | 10:00 | 00:10")

      schedule = Schedule.new("09:00", "18:00", 1, activities: activities)

      expect { schedule.add_activity(activity) }.to raise_error(ArgumentError)
    end

    it "throws error when there is no free slot" do
      activities = setup_activities <<~ACTIVITIES
        1 | fixed activity 1 | 16:00 | 01:00
        2 | fixed activity 2 | 10:00 | 00:30
      ACTIVITIES

      activity = setup_activity("3 | activity | 16:30 | 00:10")

      schedule = Schedule.new("09:00", "18:00", 1, activities: activities)
      
      expect { schedule.add_activity(activity) }.to raise_error(ArgumentError)
    end
  end

  context "with nonfixed activities" do
    context "handles nonfixed events" do
      context "adds successfully" do
        it "when there is enough space" do
          activities = setup_activities <<~ACTIVITIES
            1 | fixed activity 1 | 10:00 | 00:30
            2 | fixed activity 2 | 12:00 | 00:45
            3 | fixed activity 3 | 16:00 | 01:00
          ACTIVITIES
  
          activity = setup_activity("4 | nonfixed activity | | 01:30")

          expected_schedule = setup_events <<~EVENTS
            1 | fixed activity 1  | 10:00 | 00:30 | true  |
            4 | nonfixed activity | 10:30 | 01:30 | false | 
            2 | fixed activity 2  | 12:00 | 00:45 | true  |  
            3 | fixed activity 3  | 16:00 | 01:00 | true  |
          EVENTS

          schedule = Schedule.new("09:00", "18:00", 1, activities: activities)
          schedule.add_activity(activity)

          expect_equal(schedule, expected_schedule)
        end

        it "when there are fixed events outside preferred time" do
          activities = setup_activities <<~ACTIVITIES
            1 | fixed activity 1 | 09:00 | 00:30
            2 | fixed activity 2 | 10:00 | 00:45
            3 | fixed activity 3 | 16:00 | 01:00
            4 | fixed activity 4 | 08:00 | 00:10
          ACTIVITIES

          activity = setup_activity("5 | nonfixed activity | | 00:30")
  
          expected_schedule = setup_events <<~EVENTS
            4 | fixed activity 4  | 08:00 | 00:10 | true  |
            1 | fixed activity 1  | 09:00 | 00:30 | true  |
            5 | nonfixed activity | 09:30 | 00:30 | false | 
            2 | fixed activity 2  | 10:00 | 00:45 | true  |
            3 | fixed activity 3  | 16:00 | 01:00 | true  |
          EVENTS

          schedule = Schedule.new("09:00", "11:00", 1, activities: activities)
          schedule.add_activity(activity)

          expect_equal(schedule, expected_schedule)

          activity = setup_activity("6 | nonfixed activity | | 01:00")
          
          expect { schedule.add_activity(activity) }.to raise_error(ArgumentError)
        end
      end

      it "raises error when there is not enough space" do
        activities = setup_activities <<~ACTIVITIES
          1 | fixed activity 1 | 10:00 | 00:30
          2 | fixed activity 2 | 12:00 | 00:45
          3 | fixed activity 3 | 16:00 | 01:00
          4 | fixed activity 4 | 08:00 | 00:10
          5 | fixed activity 5 | 19:00 | 00:30
        ACTIVITIES

        activity = setup_activity("4 | nonfixed activity | | 04:30")

        schedule = Schedule.new("09:00", "18:00", 1, activities: activities)

        expect { schedule.add_activity(activity) }.to raise_error(ArgumentError)
      end

      it "reschedule if there is need" do
        activities = setup_activities <<~ACTIVITIES
          1 | fixed activity 1    | 10:00 | 00:30 
          2 | fixed activity 2    | 12:00 | 00:45 
          3 | fixed activity 3    | 16:00 | 01:00
          4 | nonfixed activity 1 |       | 00:30
          5 | nonfixed activity 2 |       | 01:00
          6 | nonfixed activity 3 |       | 01:00
        ACTIVITIES

        rescheduling_activity = setup_activity("7 | nonfixed activity 4 | | 02:30")

        expected_schedule_1 = setup_events <<~EVENTS
          4 | nonfixed activity 1 | 09:00 | 00:30 | false | 
          1 | fixed activity 1    | 10:00 | 00:30 | true  |
          5 | nonfixed activity 2 | 10:30 | 01:00 | false | 
          2 | fixed activity 2    | 12:00 | 00:45 | true  |
          6 | nonfixed activity 3 | 12:45 | 01:00 | false | 
          3 | fixed activity 3    | 16:00 | 01:00 | true  |
        EVENTS

        schedule = Schedule.new("09:00", "18:00", 1, activities: activities)

        expect_equal(schedule, expected_schedule_1)

        expected_schedule_2 = setup_events <<~EVENTS
          4 | nonfixed activity 1 | 09:00 | 00:30 | false | 
          1 | fixed activity 1    | 10:00 | 00:30 | true  |
          5 | nonfixed activity 2 | 10:30 | 01:00 | false | 
          2 | fixed activity 2    | 12:00 | 00:45 | true  |
          7 | nonfixed activity 4 | 12:45 | 02:30 | false | 
          3 | fixed activity 3    | 16:00 | 01:00 | true  |
          6 | nonfixed activity 3 | 17:00 | 01:00 | false | 
        EVENTS

        schedule.add_activity(rescheduling_activity)

        # expect_equal(schedule, expected_schedule_2)
      end
    end
  end

  context "with repeating activities" do
    context "creates breakpoints" do
      it "for two parts" do
        empty_schedule = Schedule.new("09:00", "18:00", 1)
        empty_schedule.send(:create_breakpoint, 2)

        expect(empty_schedule.breakpoints[2]).to eq(["13:30"])
      end

      it "for three parts" do
        empty_schedule = Schedule.new("09:00", "18:00", 1)
        empty_schedule.send(:create_breakpoint, 3)

        expect(empty_schedule.breakpoints[3]).to eq(["12:00", "15:00"])
      end
    end

    context "handles repeated events" do
      context "creates successfully" do 
        it "with two parts" do
          activities = setup_activities <<~ACTIVITIES
            1 | fixed activity 1 | 10:00 | 00:30
            2 | fixed activity 2 | 12:00 | 00:45
            3 | fixed activity 3 | 16:00 | 01:00 
          ACTIVITIES
  
          activity = setup_activity("4 | repeat activity | | 00:30 | 2")

          expected_schedule = setup_events <<~EVENTS
            4 | repeat activity   | 09:00 | 00:30 | false |
            1 | fixed activity 1  | 10:00 | 00:30 | true  |
            2 | fixed activity 2  | 12:00 | 00:45 | true  |
              |                   | 13:30 |       | true  | breakpoint 2 
            4 | repeat activity   | 13:30 | 00:30 | false |
            3 | fixed activity 3  | 16:00 | 01:00 | true  |
          EVENTS

          schedule = Schedule.new("09:00", "18:00", 1, activities: activities)
          schedule.add_activity(activity)

          expect_equal(schedule, expected_schedule)
        end

        it "with three parts" do
          activities = setup_activities <<~ACTIVITIES
            1 | fixed activity 1 | 10:00 | 00:30
            2 | fixed activity 2 | 12:00 | 00:45
            3 | fixed activity 3 | 16:00 | 01:00 
          ACTIVITIES
  
          activity = setup_activity("4 | repeat activity | | 00:30 | 3")

          expected_schedule = setup_events <<~EVENTS
            4 | repeat activity   | 09:00 | 00:30 | false |
            1 | fixed activity 1  | 10:00 | 00:30 | true  |
              |                   | 12:00 |       | true  | breakpoint 3 
            2 | fixed activity 2  | 12:00 | 00:45 | true  |
            4 | repeat activity   | 12:45 | 00:30 | false |
              |                   | 15:00 |       | true  | breakpoint 3 
            4 | repeat activity   | 15:00 | 00:30 | false |
            3 | fixed activity 3  | 16:00 | 01:00 | true  |
          EVENTS

          schedule = Schedule.new("09:00", "18:00", 1, activities: activities)
          schedule.add_activity(activity)

          expect_equal(schedule, expected_schedule)
        end
      end
    end
  end

  private

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

    Activity.new({
      id: activity_id, 
      title: title, 
      start_time: start_time,
      duration: duration,
      repeat: repeat
    })
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