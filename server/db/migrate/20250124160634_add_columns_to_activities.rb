class AddColumnsToActivities < ActiveRecord::Migration[7.1]
  def change
    change_table :activities do |t|
      t.boolean :days, array: true, :default => []
    end
  end
end
