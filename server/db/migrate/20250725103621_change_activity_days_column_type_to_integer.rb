class ChangeActivityDaysColumnTypeToInteger < ActiveRecord::Migration[7.1]
  def change
    remove_column :activities, :days, :boolean

    change_table :activities do |t|
      t.integer :days, array: true, :default => []
    end
  end
end
