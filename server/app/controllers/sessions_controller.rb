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
      }, status: :not_found
    end
  end

  def get_friends
    user = User.find_by(token: user_token)
    if user
      render json: {
        status: { code: 200, message: '' },
        data: user.friends()
      }
    else
      render json: {
        status: { message: "User couldn't be found." }
      }, status: :not_found
    end
  end

  def add_friend
    user = User.find_by(token: user_token)
    friend = User.find_by(username: params[:username])

    if user.add_friend(friend)
      render json: {
        status: { code: 200, message: 'Connection created successfully.' },
        data: {}
      }
    else
      render json: {
        status: { message: "User couldn't be found." }
      }, status: :not_found
    end
  end

  def get
    user = User.find_by(token: user_token)
    if user
      render json: {
        status: { code: 200 },
        data: user
      }
    else
      render json: {
        status: { message: "User couldn't be found." }
      }, status: :not_found
    end
  end

  def destroy
    session[:user_id] = nil
    render json: {
      status: { code: 200, message: 'Signed out successfully.' },
      data: {}
    }
  end

  def update_params
    params.require(:first_name)
    params.require(:last_name)

    params.require(:start_time)
    params.require(:end_time)

    params.require(:weekend_start_time)
    params.require(:weekend_end_time)

    params.require(:session).permit(:first_name, :last_name, :start_time, :end_time, :weekend_start_time, :weekend_end_time)
  end

  def friend_params
    params.require(:username)
    params.require(:session).permit(:username)
  end
end
