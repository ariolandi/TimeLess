Rails.application.routes.draw do
  post '/signup' => 'user#create'
  get '/list' => 'user#list'

  put '/login' => 'sessions#create'
  delete '/logout' => 'sessions#destroy'
  put '/update_user' => 'sessions#update'
  get 'profile' => 'sessions#get'
  put '/add_friend' => 'sessions#add_friend'
  get 'friends' => 'sessions#get_friends'

  post '/activity/create' => 'activity#create'
  put '/activity/update/:id' => 'activity#update'
  delete '/activity/delete/:id' => 'activity#delete'
  get '/activity/:id' => 'activity#get_by_id'

  get '/schedule/:day' => 'schedule#get_schedule'
  post '/schedule' => 'schedule#create'

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
