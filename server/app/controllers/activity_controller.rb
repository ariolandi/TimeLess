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
