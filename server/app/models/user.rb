class User < ApplicationRecord
  has_secure_password
  has_secure_password :recovery_password, validations: false

  def self.login(user)
    user_token = SecureRandom.hex
    user.token = user_token
    user.save
  end
end
