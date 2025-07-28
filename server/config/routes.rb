Rails.application.routes.draw do
  post '/signup' => 'user#create'

  post '/login' => 'sessions#create'
  get '/logout' => 'sessions#destroy'
  post '/update_user' => 'sessions#update'

  post '/activity' => 'activity#create'
  post '/activity/day' => 'activity#get_day'

  post '/schedule' => 'event#get_schedule'
  post '/event' => 'event#create'

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
