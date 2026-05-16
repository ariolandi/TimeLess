class Connection < ApplicationRecord
    belongs_to :sender, class_name: "User", foreign_key: "sender"
    belongs_to :recipient, class_name: "User", foreign_key: "recipient"
end
