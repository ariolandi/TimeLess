class User < ApplicationRecord
  validates :username, :email, presence: true
  has_secure_password
  has_secure_password :recovery_password, validations: false
  validates :username, :email, uniqueness: { case_sensitive: false }
  has_many :connections, dependent: :destroy
  has_many :friends_1, class_name: "Connection", foreign_key: :sender
  has_many :friends_2, class_name: "Connection", foreign_key: :recipient


  def self.login(user)
    user_token = SecureRandom.hex
    user.token = user_token
    user.save
  end

  def add_friend(friend)
    connection = Connection.new(sender: self, recipient: friend, accepted: false)
    connection.save
  end

  def friends()
    flist_1 = self.friends_1.map { |f| { user: f.recipient, status: f.accepted } }
    flist_2 = self.friends_2.map { |f| { user: f.sender, status: f.accepted } } 

    flist_1.concat(flist_2)
  end
end
