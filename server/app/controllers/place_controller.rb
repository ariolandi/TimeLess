require 'securerandom'

class PlaceController < ApplicationController
  def create
    place = Place.new(place_params)
    if place.save
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

  def place_params
    params.require(:place).permit(:user_id)
  end
end
