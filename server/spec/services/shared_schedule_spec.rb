require "rails_helper"
require_relative "schedule_helper"

# Activities are described in format:
#  activity_id | title | start_time | duration | repeat
# Events are described in format:
#  activity_id | title | start_time | duration | fixed | system

RSpec.describe SharedSchedule do
  include ScheduleSpecHelper

  context "for fixed events" do
    it "handles one schedule" do
      start_time = "09:00"
      end_time = "18:00"
      day = 1
      empty_schedule = Schedule.new(start_time, end_time, day)
      activity = setup_activity("1 | fixed activity | 10:00 | 00:10")

      sharedSchedule = SharedSchedule.new([empty_schedule], day)
      sharedSchedule.add_shared_activity(activity)

      expected_schedule = setup_events <<~EVENTS
          1 | fixed activity | 10:00 | 00:10 | true  |
        EVENTS

      expect_equal(empty_schedule, expected_schedule)
    end

    it "handles multiple schedules" do
      day = 1
      schedule1 = Schedule.new("08:00", "16:00", day)
      schedule2 = Schedule.new("09:00", "18:00", day)
      schedules = [schedule1, schedule2]
      activity = setup_activity("1 | fixed activity | 8:30 | 00:10")

      sharedSchedule = SharedSchedule.new(schedules, day)
      sharedSchedule.add_shared_activity(activity)

      expected_schedule1 = setup_events <<~EVENTS
          1 | fixed activity | 08:30 | 00:10 | true  |
        EVENTS

      expected_schedule2 = setup_events <<~EVENTS
        1 | fixed activity | 08:30 | 00:10 | true  |
      EVENTS

      expect_equal(schedule1, expected_schedule1)
      expect_equal(schedule2, expected_schedule2)
    end

    it "raises an error when activity cannot be added to all schedules" do
      day = 1
      activities = setup_activities <<~ACTIVITIES
        1 | fixed activity 1 | 09:00 | 01:00
        2 | fixed activity 2 | 10:00 | 00:30
      ACTIVITIES
      schedule1 = Schedule.new("08:00", "16:00", day)
      schedule2 = Schedule.new("09:00", "18:00", day, activities: activities)
      schedules = [schedule1, schedule2]
      activity = setup_activity("1 | fixed activity | 9:30 | 00:10")

      sharedSchedule = SharedSchedule.new(schedules, day)

      expect { sharedSchedule.add_shared_activity(activity) }.to raise_error(ArgumentError)
    end
  end

  context "for nonfixed events" do
    it "handles one schedule" do
      start_time = "09:00"
      end_time = "18:00"
      day = 1
      empty_schedule = Schedule.new(start_time, end_time, day)
      activity = setup_activity("1 | nonfixed activity | | 00:10")

      sharedSchedule = SharedSchedule.new([empty_schedule], day)

      sharedSchedule.add_shared_activity(activity)

      expected_schedule = setup_events <<~EVENTS
          1 | nonfixed activity | 09:00 | 00:10 | true |
        EVENTS

      expect_equal(empty_schedule, expected_schedule)
    end

    it "handles multiple schedules" do
      day = 1
      activities1 = setup_activities <<~ACTIVITIES
        1 | fixed activity 1 | 09:00 | 01:00
        2 | fixed activity 2 | 10:00 | 00:30
      ACTIVITIES

      activities2 = setup_activities <<~ACTIVITIES
        3 | fixed activity 1 | 09:00 | 00:30
        4 | fixed activity 2 | 12:00 | 00:30
      ACTIVITIES
      schedule1 = Schedule.new("08:00", "16:00", day, activities: activities1)
      schedule2 = Schedule.new("09:00", "18:00", day, activities: activities2)
      schedules = [schedule1, schedule2]
      activity = setup_activity("5 | nonfixed activity | | 00:10")
      sharedSchedule = SharedSchedule.new(schedules, day)
      sharedSchedule.add_shared_activity(activity)

      expected_schedule1 = setup_events <<~EVENTS
          1 | fixed activity 1  | 09:00 | 01:00 | true |
          2 | fixed activity 2  | 10:00 | 00:30 | true |
          5 | nonfixed activity | 10:30 | 00:10 | true
        EVENTS

      expected_schedule2 = setup_events <<~EVENTS
        3 | fixed activity 1  | 09:00 | 00:30 | true |
        5 | nonfixed activity | 10:30 | 00:10 | true |
        4 | fixed activity 2  | 12:00 | 00:30 | true |
      EVENTS

      expect_equal(schedule1, expected_schedule1)
      expect_equal(schedule2, expected_schedule2)
    end
  end
end