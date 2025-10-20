class User < ApplicationRecord
  validates :username, :email, presence: true
  has_secure_password
  has_secure_password :recovery_password, validations: false
  validates :username, :email, uniqueness: { case_sensitive: false }
  has_many :connections, dependent: :destroy
  has_many :friends, through: :connections, :source => :user

  def self.login(user)
    user_token = SecureRandom.hex
    user.token = user_token
    user.save
  end
end
