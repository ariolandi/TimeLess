class ApplicationController < ActionController::API
  # def current_user
  #   @current_user ||= User.find(session[:user_id]) if session[:user_id]
  # end
  # helper_method :current_user

  def user_token
    request.headers['Authorization']&.gsub('Bearer ', '')
  end
end
