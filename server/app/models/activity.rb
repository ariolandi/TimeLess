class Activity < ApplicationRecord
    validates :user_id, :title, :duration, presence: true

    has_many :activity_guests, dependent: :destroy
    has_many :guests, through: :activity_guests, :source => :user
end