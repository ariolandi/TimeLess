class ReferencesCleanup < ActiveRecord::Migration[7.1]
  def change
    add_index :activities, [:user_id]

    add_index :events, [:user_id]

    add_index :activity_guests, [:user_id]
    add_index :activity_guests, [:activity_id]
  end
end
