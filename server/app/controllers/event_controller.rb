require 'securerandom'

class EventController < ApplicationController
  def create
    activity = Activity.find_by(id: event_params[:activity_id])
    user = User.find_by(token: user_token)

    if activity.nil? || user.nil? || user.id != activity.user_id
      render json: {
        status: { message: "No such user or activity" }
      }, status: :unprocessable_entity
    else
      activity.days.each do |day|
        is_weekend = day > 4

        day_start_time = is_weekend ? user.weekend_start_time : user.start_time
        day_end_time = is_weekend ? user.weekend_end_time : user.end_time

        events = Event.where(user_id: user.id, day: day).to_a
        schedule = Schedule.new(day_start_time, day_end_time, day, events: events)
        schedule.add_activity(activity)
        
        schedule.schedule.each { |event| event.save }
      end

      render json: {
        status: { code: 200, message: '' },
        data: {}
      }
    end
  end

  def get_schedule
    user = User.find_by(token: user_token)

    if user.nil?
      render json: {
        status: { message: "No such user" }
      }, status: :unprocessable_entity
    else
      day = params[:day]
      events = Event
        .where(user_id: user.id, day: day, event_type: nil)
        .map(&:represent)
        .sort_by { |event| event[:start_time] }

      render json: {
        status: { code: 200, message: '' },
        data: events
      }
    end
  end

  private

  def event_params
    params.require(:event).permit(:user_id, :activity_id, :start_time, :day)
  end
end
