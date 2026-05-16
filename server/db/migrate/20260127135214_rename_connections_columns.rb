class RenameConnectionsColumns < ActiveRecord::Migration[7.1]
  def change
     change_table :connections do |t|
      t.rename :user_1, :sender
      t.rename :user_2, :recipient
    end
  end
end
