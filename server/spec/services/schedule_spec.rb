require "rails_helper"

RSpec.describe Schedule do
  before(:each) do
    @user_id = 1
    @start_time = "09:00"
    @end_time = "18:00"

    @start_event = Event.create(
      "Start",
      start_time: @start_time,
      system: true,
    )

    @end_event = Event.create(
      "End",
      start_time: @end_time,
      system: true,
    )

    @empty_schedule = Schedule.new(@start_time, @end_time)
  end

  it "creates successfully" do
    expect(@empty_schedule.instance_variable_get(:@start).start_time.to_fs(:time)).to eq(@start_time)
    expect(@empty_schedule.instance_variable_get(:@end).start_time.to_fs(:time)).to eq(@end_time)
  end

  context "handles bad timing" do
    it "with strings" do
      expect { Schedule.new("asdf", @end_time) }.to raise_error(ArgumentError)
    end

    it "with integer" do
      expect { Schedule.new(9, @end_time) }.to raise_error(TypeError)
    end
  end

  context "without any activities" do
    it "creates system events" do
      expect(@empty_schedule.schedule.map(&:attributes)).to eq([@start_event, @end_event].map(&:attributes))
    end

    it "adds fixed activity correctly" do
      activity = Activity.new({
        id: 2,
        user_id: @user_id, 
        title: "fixed activity", 
        duration: "00:10",
        start_time: "10:00"
      })

      expected_schedule = setup_events <<~EVENTS
          | Start          | 09:00 | 00:00 | true  | true
        2 | fixed activity | 10:00 | 00:10 | true  | false
          | End            | 18:00 | 00:00 | true  | true
      EVENTS

      @empty_schedule.add_activity(activity)
      expected_schedule.map!(&:attributes)
      schedule = @empty_schedule.schedule.map(&:attributes)
      expect(schedule).to eq(expected_schedule)
    end
  
    it "adds fixed activity after ending hour" do
      activity = Activity.new({
        id: 2,
        user_id: @user_id, 
        title: "fixed activity", 
        duration: "00:10",
        start_time: "19:00"
      })

      expected_schedule = setup_events <<~EVENTS
          | Start          | 09:00 | 00:00 | true  | true
          | End            | 18:00 | 00:00 | true  | true
        2 | fixed activity | 19:00 | 00:10 | true  | false
      EVENTS

      @empty_schedule.add_activity(activity)
      expected_schedule.map!(&:attributes)
      schedule = @empty_schedule.schedule.map(&:attributes)
      expect(schedule).to eq(expected_schedule)
    end

    it "adds fixed activity before starting hour" do
      activity = Activity.new({
        id: 2,
        user_id: @user_id, 
        title: "fixed activity", 
        duration: "00:10",
        start_time: "08:00"
      })

      expected_schedule = setup_events <<~EVENTS
        2 | fixed activity | 08:00 | 00:10 | true  | false
          | Start          | 09:00 | 00:00 | true  | true
          | End            | 18:00 | 00:00 | true  | true
      EVENTS

      @empty_schedule.add_activity(activity)
      expected_schedule.map!(&:attributes)
      schedule = @empty_schedule.schedule.map(&:attributes)
      expect(schedule).to eq(expected_schedule)
    end
  end

  context "with fixed activities" do
    before(:each) do
      activities = setup_activities <<~ACTIVITIES
        1 | 1 | fixed activity 1 | 16:00 | 01:00
        1 | 2 | fixed activity 2 | 10:00 | 00:30
      ACTIVITIES

      @expected_events = setup_events <<~EVENTS
        2 | fixed activity 2  | 10:00 | 00:30 | true  | false
        1 | fixed activity 1  | 16:00 | 01:00 | true  | false
      EVENTS
  
      @schedule = Schedule.new(@start_time, @end_time, activities: activities)
    end

    it "creates events for the activities" do
      schedule = @schedule.schedule.map(&:attributes)

      @expected_events.each do |expected_event|
        expect(schedule).to include(expected_event.attributes)
      end
    end

    it "calculates the schedule correctly" do
      expected_schedule = setup_events <<~EVENTS
          | Start             | 09:00 | 00:00 | true | true
        2 | fixed activity 2  | 10:00 | 00:30 | true | false
        1 | fixed activity 1  | 16:00 | 01:00 | true | false
          | End               | 18:00 | 00:00 | true | true
      EVENTS

      schedule = @schedule.schedule.map(&:attributes)
      expected_schedule.map!(&:attributes)
      expect(schedule).to eq(expected_schedule)
    end

    it "throws error for time duplications" do
      activity = Activity.new(
        id: 3,
        user_id: @user_id, 
        title: "duplicate activity", 
        duration: "00:10",
        start_time: "10:00"
      )

      expect { @schedule.add_activity(activity) }.to raise_error(ArgumentError)
    end

    it "throws error when there is no free slot" do
      activity = Activity.new({
        id: 3,
        user_id: @user_id, 
        title: "fixed activity 16:30", 
        duration: "00:10",
        start_time: "16:30"
      })

      expect { @schedule.add_activity(activity) }.to raise_error(ArgumentError)
    end
  end

  context "with nonfixed activities" do
    context "creates breakpoints" do
      it "for two parts" do
        breakpoint = Event.create(
          "breakpoint",
          start_time: "13:30",
          system: true
        ).attributes

        @empty_schedule.send(:create_breakpoint, 2)

        breakpoints = @empty_schedule.breakpoints
        breakpoints = breakpoints.map { |key, values| [key, values.map(&:attributes)] }.to_h

        expect(breakpoints).to eq({2 => [breakpoint]})
      end

      it "for three parts" do
        breakpoint_1 = Event.create(
          "breakpoint",
          start_time: "12:00",
          system: true
        ).attributes

        breakpoint_2 = Event.create(
          "breakpoint",
          start_time: "15:00",
          system: true
        ).attributes

        @empty_schedule.send(:create_breakpoint, 3)

        breakpoints = @empty_schedule.breakpoints
        breakpoints = breakpoints.map { |key, values| [key, values.map(&:attributes)] }.to_h

        expect(breakpoints).to eq({3 => [breakpoint_1, breakpoint_2]})
      end
    end

    context "handles nonfixed events" do
      before(:each) do
        activities = setup_activities <<~ACTIVITIES
          1 | 1 | fixed activity 1 | 10:00 | 00:30
          1 | 2 | fixed activity 2 | 12:00 | 00:45
          1 | 3 | fixed activity 3 | 16:00 | 01:00
        ACTIVITIES
  
        @schedule = Schedule.new(@start_time, @end_time, activities: activities)
      end

      it "adds successfully when there is enough space" do
        activity = Activity.new({
          id: 4,
          user_id: @user_id, 
          title: "nonfixed activity", 
          duration: "01:30"
        })

        expected_schedule = setup_events <<~EVENTS
            | Start             | 09:00 | 00:00 | true  | true
          1 | fixed activity 1  | 10:00 | 00:30 | true  | false
          4 | nonfixed activity | 10:30 | 01:30 | false | false
          2 | fixed activity 2  | 12:00 | 00:45 | true  | false
          3 | fixed activity 3  | 16:00 | 01:00 | true  | false
            | End               | 18:00 | 00:00 | true  | true
        EVENTS

        @schedule.add_activity(activity)

        expected_schedule.map!(&:attributes)
        schedule = @schedule.schedule.map(&:attributes)
        expect(schedule).to eq(expected_schedule)
      end

      it "raises error when there is not enough space" do
        activity = Activity.new({
          id: 4,
          user_id: @user_id, 
          title: "nonfixed activity", 
          duration: "04:30"
        })

        expect { @schedule.add_activity(activity) }.to raise_error(ArgumentError)
      end

      it "reschedule if there is need" do
        activities = setup_activities <<~ACTIVITIES
          1 | 4 | nonfixed activity 1 | | 00:30
          1 | 5 | nonfixed activity 2 | | 01:00
          1 | 6 | nonfixed activity 3 | | 01:00
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

        activities.each { |activity| @schedule.add_activity(activity) }

        expected_schedule_1.map!(&:attributes)
        schedule = @schedule.schedule.map(&:attributes)
        expect(schedule).to eq(expected_schedule_1)

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

        @schedule.add_activity(rescheduling_activity)

        expected_schedule_2.map!(&:attributes)
        schedule = @schedule.schedule.map(&:attributes)
        expect(schedule).to eq(expected_schedule_2)
      end
    end
  end

  private

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