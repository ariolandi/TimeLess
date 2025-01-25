# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_01_24_160634) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.integer "user_id"
    t.string "title", null: false
    t.string "description"
    t.time "duration", null: false
    t.integer "place"
    t.integer "repeat", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.time "start_time"
  end

  create_table "places", force: :cascade do |t|
    t.integer "user_id"
    t.string "name", null: false
    t.integer "distance", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "password_digest", null: false
    t.string "email", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.time "start_time"
    t.time "end_time"
    t.time "weekend_start_time"
    t.time "weekend_end_time"
    t.string "token"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "activities", "places", column: "place"
  add_foreign_key "activities", "users"
  add_foreign_key "places", "users"
end
