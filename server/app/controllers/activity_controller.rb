require 'securerandom'

class ActivityController < ApplicationController
  def create
    user = User.find_by(token: user_token)

    activity = Activity.new(activity_params)
    activity.user_id = user.id
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

  def get_all
    user = User.find_by(token: user_token)
    if user.nil?
      render json: {
        status: { message: "No such user" }
      }, status: :unprocessable_entity
    else
      render json: {
        status: { code: 200, message: '' },
        data: Activity.where(user_id: user.id)
      }
    end
  end

  private

  def user_token
    request.headers['Authorization']&.gsub('Bearer ', '')
  end

  def activity_params
    params.require(:activity).permit(:title, :description, :duration, :repeat, :start_time)
  end
end
