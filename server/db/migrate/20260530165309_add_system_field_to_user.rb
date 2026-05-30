class AddSystemFieldToUser < ActiveRecord::Migration[7.1]
  def change
    change_table :users do |t|
      t.boolean :system, default: false
    end
  end
end
