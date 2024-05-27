class CreatePlace < ActiveRecord::Migration[7.1]
  def change
    create_table :places do |t|
      t.integer :user_id
      t.string :name, null: false
      t.integer :distance, default: 0, null: false
      t.timestamps
    end

    add_foreign_key :places, :users, column: :user_id
  end
end
