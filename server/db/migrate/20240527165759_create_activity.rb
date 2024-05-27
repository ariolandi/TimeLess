class CreateActivity < ActiveRecord::Migration[7.1]
  def change
    create_table :activities do |t|
      t.integer :user_id
      t.string :title, null: false
      t.string :description
      t.time :duration, null: false
      t.integer :place
      t.integer :repeat, default: 0

      t.timestamps
    end

    add_foreign_key :activities, :users, column: :user_id
    add_foreign_key :activities, :places, column: :place
  end
end
