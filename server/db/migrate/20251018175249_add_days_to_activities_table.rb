class AddDaysToActivitiesTable < ActiveRecord::Migration[7.1]
  def change
    change_table :activities do |t|
      t.date :date
    end

    change_table :events do |t|
      t.date :date
    end
  end
end
