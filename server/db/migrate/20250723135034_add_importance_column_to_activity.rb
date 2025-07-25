class AddImportanceColumnToActivity < ActiveRecord::Migration[7.1]
  def change
     change_table :activities do |t|
      t.integer :importance, default: 2
    end
  end
end
