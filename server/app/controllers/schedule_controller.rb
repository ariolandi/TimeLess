require 'securerandom'

class ScheduleController < ApplicationController
  def create
    activity = Activity.find_by(id: event_params[:activity_id])
    user = User.find_by(token: user_token)

    if activity.nil? || user.nil? || user.id != activity.user_id
      render json: {
        status: { message: "No such user or activity" }
      }, status: :unprocessable_entity
    else
      ScheduleHelper.add(user, activity)

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
    params.permit(:user_id, :activity_id, :start_time, :day)
  end
end
