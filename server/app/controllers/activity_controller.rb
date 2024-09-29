require 'securerandom'

class ActivityController < ApplicationController
  def create
    user_token = request.headers['Authorization']&.gsub('Bearer ', '')
    user = User.find_by(token: user_token)

    activity = Activity.new(activity_params)
    activity.user_id = user.id
    if activity.save
      render json: {
        status: { code: 200, message: 'Created successfully.' }
      }
    else
      render json: {
        status: { message: "User couldn't be created successfully." }
      }, status: :unprocessable_entity
    end
  end

  private

  def activity_params
    params.require(:activity).permit(:title, :description, :duration, :repeat)
  end
end
