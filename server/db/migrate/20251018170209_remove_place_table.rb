class RemovePlaceTable < ActiveRecord::Migration[7.1]
  def change
    remove_column :activities, :place, :integer

    change_table :activities do |t|
      t.string :place
    end

    drop_table :places
  end
end
