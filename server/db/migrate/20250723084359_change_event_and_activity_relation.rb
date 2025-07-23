class ChangeEventAndActivityRelation < ActiveRecord::Migration[7.1]
  def change
    remove_column :events, :days, :boolean
    remove_column :events, :activity_id, :integer


    change_table :events do |t|
      t.belongs_to :activity, foreign_key: true
    end
  end
end
