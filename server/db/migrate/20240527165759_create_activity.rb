class CreateActivity < ActiveRecord::Migration[7.1]
  def change
    create_table :activities do |t|
      t.integer :user_id
      t.text :title, null: false
      t.text :description
      t.duration :duration, null: false
      t.integer :place
      t.integer :repeat, default: 0
      t.integer :start_time

      t.timestamps
    end

    add_foreign_key :activities, :users, column: :user_id
    add_foreign_key :activities, :places, column: :place
  end
end
