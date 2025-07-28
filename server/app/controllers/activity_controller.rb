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

  def get_day
    user = User.find_by(token: user_token)

    if user.nil?
      render json: {
        status: { message: "No such user" }
      }, status: :unprocessable_entity
    else
      day = params[:day]
      activities = Activity.where(user_id: user.id).select { |activity| activity.days.include?(day) }

      render json: {
        status: { code: 200, message: '' },
        data: activities
      }
    end
  end

  private

  def activity_params
    params.require(:activity).permit(:user_id, :title, :description, :duration, :repeat, :start_time, days: [])
  end
end
