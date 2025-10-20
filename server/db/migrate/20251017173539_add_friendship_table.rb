class AddFriendshipTable < ActiveRecord::Migration[7.1]
  def change
    create_table :connections, primary_key: [:user_1, :user_2] do |t|
      t.integer :user_1, null: false
      t.integer :user_2, null: false
      t.boolean :accepted, null:false, default: false

      t.timestamps
    end
    
    add_foreign_key :connections, :users, column: :user_1
    add_foreign_key :connections, :users, column: :user_2
  end
end
