class AddUserToken < ActiveRecord::Migration[7.1]
  change_table :users do |t|
    t.text :token
  end
end
