class AddColumnsToActivities < ActiveRecord::Migration[7.1]
  def change
    change_table :activities do |t|
      t.string :start_time
    end
  end
end
