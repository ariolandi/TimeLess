class User < ApplicationRecord
  validates :username, :email, presence: true
  has_secure_password
  has_secure_password :recovery_password, validations: false
  validates :username, :email, uniqueness: { case_sensitive: false }
  has_many :connections, dependent: :destroy
  has_many :friends_1, class_name: "Connection", foreign_key: :user_1
  has_many :friends_2, class_name: "Connection", foreign_key: :user_2


  def self.login(user)
    user_token = SecureRandom.hex
    user.token = user_token
    user.save
  end

  def add_friend(friend)
    connection = Connection.new(user_1: self, user_2: friend)
    connection.save
  end

  def friends()
    flist_1 = self.friends_1.map { |f| f.user_2 }
    flist_2 = self.friends_2.map { |f| f.user_1 } 

    flist_1.concat(flist_2)
  end
end
