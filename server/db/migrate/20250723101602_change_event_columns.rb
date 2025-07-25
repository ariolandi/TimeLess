class ChangeEventColumns < ActiveRecord::Migration[7.1]
  def change
    change_table :activities do |t|
      t.change :days, :integer, array: true, :default => []
    end
  end
end
