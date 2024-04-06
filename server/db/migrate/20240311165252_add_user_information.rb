class AddUserInformation < ActiveRecord::Migration[7.1]
  def change
    change_table :users do |t|
      t.string :first_name
      t.string :last_name

      t.time :start_time
      t.time :end_time
      t.time :weekend_start_time
      t.time :weekend_end_time
    end
  end
end
