class Activity < ApplicationRecord
    validates :user_id, :title, :duration, presence: true
end
