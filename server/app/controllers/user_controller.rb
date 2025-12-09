require 'securerandom'

class UserController < ApplicationController
  def create
    user = User.new(user_params)

    if user.save
      User.login(user)
      render json: {
        status: { code: 200, message: 'Signed up successfully.' },
        data: { token: user.token }
      }
    else
      render json: {
        status: { message: "User couldn't be created successfully." }
      }, status: :unprocessable_entity
    end
  end

  def list
    user = User.find_by(token: user_token)
    
    if user
      usernames = User.all
        .map { |user| user.username }
        .filter { |username| username != user.username }

      render json: {
        status: { code: 200, message: '' },
        data: usernames
      }
    else
      render json: {
        status: { message: "User couldn't be found." }
      }, status: :not_found
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end
