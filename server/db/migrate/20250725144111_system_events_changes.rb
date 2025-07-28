class SystemEventsChanges < ActiveRecord::Migration[7.1]
  def change
    remove_column :events, :system, :boolean

  change_table :events do |t|
    t.string :event_type
  end
  end
end
