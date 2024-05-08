class SessionsController < ApplicationController
  def check
  end

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
    if user
      puts params

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
