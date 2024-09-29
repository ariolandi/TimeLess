class User < ApplicationRecord
  validates :username, :email, presence: true
  has_secure_password
  has_secure_password :recovery_password, validations: false
  validates :first_name, presence: true, allow_blank: false, on: :update
  validates :last_name, presence: true, allow_blank: false, on: :update


  def self.login(user)
    user_token = SecureRandom.hex
    user.token = user_token
    user.save
  end
end
