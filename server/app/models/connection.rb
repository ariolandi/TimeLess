class Connection < ApplicationRecord
    belongs_to :user_1, class_name: "User", foreign_key: "user_1"
    belongs_to :user_2, class_name: "User", foreign_key: "user_2"
end
