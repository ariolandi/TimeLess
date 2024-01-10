class CreateActivities < ActiveRecord::Migration[7.1]
  def change
    create_table :activities do |t|
      t.string :name, null: false
      t.text :description
      t.integer :repeat
      t.string :day
      t.time :duration
      t.string :place
      t.integer :priority
      t.binary :system

      t.timestamps
    end

    add_reference :activities, :user, foreign_key: true
  end
end
