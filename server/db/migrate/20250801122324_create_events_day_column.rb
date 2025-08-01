class CreateEventsDayColumn < ActiveRecord::Migration[7.1]
  def change
    change_table :events do |t|
      t.integer :day
    end
  end
end
