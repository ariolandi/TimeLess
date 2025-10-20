class AddSharedActivities < ActiveRecord::Migration[7.1]
  def change
    create_table :activity_guests do |t|
      t.integer :activity_id, null: false
      t.integer :user_id, null: false

      t.timestamps
    end
    
    add_foreign_key :activity_guests, :activities, column: :activity_id
    add_foreign_key :activity_guests, :users, column: :user_id

    add_index :activity_guests, [:activity_id, :user_id], unique: true
  end
end
