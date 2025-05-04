class AddAfterColumnToEvent < ActiveRecord::Migration[7.1]
  change_table :events do |t|
    t.integer :after, array: true, :default => []
  end
end
