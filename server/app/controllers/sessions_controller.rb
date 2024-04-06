class SessionsController < ApplicationController
  def check
  end

  def create
    user = User.find_by_username(params[:username])
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      onboarded = user.first_name.present?
      render json: {
        status: { code: 200, message: 'Signed in successfully.' },
        data: { id: session[:user_id], onboarded: onboarded }
      }
    else
      render json: {
        status: { message: "User couldn't be signed in successfully." }
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
