require 'securerandom'

class ActivityController < ApplicationController
  def create
    user = User.find_by(token: user_token)

    params[:activity][:user_id] = user.id
    activity = Activity.new(activity_params)

    if activity.save
      render json: {
        status: { code: 200, message: 'Created successfully.' },
        data: activity
      }
    else
      render json: {
        status: { message: "Activity couldn't be created successfully." }
      }, status: :unprocessable_entity
    end
  end

  def update
    user = User.find_by(token: user_token)

    if user.nil?
      render json: {
        status: { message: "No such user" }
      }, status: :unprocessable_entity
    else
      id = params[:id]
      activity = Activity.where(user_id: user.id, id: id).first

      if activity.nil?
        render json: {
          status: { message: "No such activity" }
        }, status: :unprocessable_entity
      end

      if params[:start_time] != activity.start_time || 
         params[:repeat] != activity.repeat ||
         params[:days] != activity.days ||
         params[:duration] != activity.duration
        Event.where(activity_id: activity.id).destroy_all

        activity.update(activity_params)
        ScheduleHelper.add(user, activity)
      else
        activity.update(activity_params)
      end

      render json: {
        status: { code: 200, message: '' },
        data: activity
      }
    end
  end

  def get_by_id
    user = User.find_by(token: user_token)

    if user.nil?
      render json: {
        status: { message: "No such user" }
      }, status: :unprocessable_entity
    else
      id = params[:id]
      activity = Activity.where(user_id: user.id, id: id).first

      render json: {
        status: { code: 200, message: '' },
        data: activity
      }
    end
  end

  private

  def activity_params
    params.require(:activity).permit(:user_id, :title, :description, :duration, :repeat, :start_time, days: [])
  end
end
