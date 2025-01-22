class SessionsController < ApplicationController
  def create
    user = User.find_by(username: params[:username])
    if user&.authenticate(params[:password])
      user.login
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
    user = User.find_by(token: user_token)
    if user&.update(update_params)
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

  def user_token
    request.headers['Authorization']&.gsub('Bearer ', '')
  end

  def update_params
    params.require(:first_name, :last_name)
  end
end
