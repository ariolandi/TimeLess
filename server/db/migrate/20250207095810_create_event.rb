class CreateEvent < ActiveRecord::Migration[7.1]
  def change
    create_table :events do |t|
      t.integer :activity_id
      t.integer :user_id
      t.string :title
      t.boolean :system, default: false
      t.time :start_time
      t.time :end_time
      t.integer :duration
      t.boolean :days, array: true, default: []
      t.boolean :fixed, default: false
      
      t.timestamps
    end

    add_foreign_key :events, :users, column: :user_id
    add_foreign_key :events, :activities, column: :activity_id
  end
end
