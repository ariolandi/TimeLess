class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :registerable, :recoverable, :validatable, :jwt_authenticatable, jwt_revocation_strategy: self
  validates :email, uniqueness: true
  validates :username, uniqueness: true
end
