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
    connection = Connection.new(sender: self, recipient: friend, accepted: friend.system)
    connection.save
  end

  def friends()
    friends_list1 = self.friends_1.map { |f| { user: f.recipient, status: f.accepted } }
    friends_list2 = self.friends_2.map { |f| { user: f.sender, status: f.accepted } }

    friends_list1.concat(friends_list2)
  end

  def friends_requests()
    self.friends_2.where(accepted: false)
  end

  def accept_friend(friend)
    connection = Connection.find_by(sender: friend, recipient: self) ||
                 Connection.find_by(sender: self, recipient: friend)
                 
    return false unless connection

    connection.update(accepted: true)
  end
end
