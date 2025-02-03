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
      activities = Activity.where(user_id: user.id)
      days = (0..6).to_a

      activities_by_day = days.map{ |day| activities.select{|activity| (activity.days || []).empty? || activity.days[day]}}

      render json: {
        status: { code: 200, message: '' },
        data: activities_by_day
      }
    end
  end

  private

  def activity_params
    params.require(:activity).permit(:title, :description, :duration, :repeat, :start_time, days: [])
  end
end
