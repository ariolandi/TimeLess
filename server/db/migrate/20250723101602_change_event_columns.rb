class ChangeEventColumns < ActiveRecord::Migration[7.1]
  def change
    remove_column :events, :title, :string
    remove_column :events, :duration, :integer
    remove_column :events, :end_time, :time

    change_table :events do |t|
      t.integer :day
    end
  end
end
