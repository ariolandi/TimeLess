class SessionsController < ApplicationController
  def create
    user = User.find_by(username: params[:username])
    if user&.authenticate(params[:password])
      User.login(user)
      onboarded = user.first_name.present?

      render json: {
        status: { code: 200, message: 'Signed in successfully.' },
        data: { token: user.token, onboarded: onboarded }
      }
    else
      render json: {
        status: { message: "User couldn't be signed in successfully." }
      }, status: :unprocessable_entity
    end
  end

  def update
    user_token = request.headers['Authorization']&.gsub('Bearer ', '')
    user = User.find_by(token: user_token)
    puts params
    if user&.update(
      first_name: params[:first_name],
      last_name: params[:last_name],
      start_time: params[:weekday_time][:start].to_time,
      end_time: params[:weekday_time][:end].to_time,
      weekend_start_time: Time.parse(params[:weekend_time][:start]),
      weekend_end_time: Time.parse(params[:weekend_time][:end])
    )
      puts user.inspect
      user.save
      place = Place.find_by(user_id: user.id)
      unless place
        place = Place.new(user_id: user.id, name: 'home')
        place.save
      end

      render json: {
        status: { code: 200, message: 'Signed in successfully.' },
        data: {}
      }
    else
      render json: {
        status: { message: "User couldn't be found." }
      }, status: :unprocessable_entity
    end
  end

  def destroy
    session[:user_id] = nil
    render json: {
      status: { code: 200, message: 'Signed out successfully.' },
      data: {}
    }
  end
end
