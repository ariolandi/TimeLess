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

ActiveRecord::Schema[7.1].define(version: 2025_10_18_175904) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.integer "user_id"
    t.text "title", null: false
    t.text "description"
    t.string "duration", null: false
    t.integer "repeat", default: 0
    t.string "start_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "importance", default: 2
    t.integer "days", default: [], array: true
    t.string "place"
    t.date "date"
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "connections", primary_key: ["user_1", "user_2"], force: :cascade do |t|
    t.integer "user_1", null: false
    t.integer "user_2", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "accepted", default: false, null: false
  end

  create_table "events", force: :cascade do |t|
    t.integer "user_id"
    t.time "start_time"
    t.boolean "fixed", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "activity_id"
    t.string "event_type"
    t.integer "day"
    t.date "date"
    t.index ["activity_id"], name: "index_events_on_activity_id"
    t.index ["user_id"], name: "index_events_on_user_id"
  end

  create_table "shared_activities", force: :cascade do |t|
    t.integer "activity_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activity_id", "user_id"], name: "index_shared_activities_on_activity_id_and_user_id", unique: true
    t.index ["activity_id"], name: "index_shared_activities_on_activity_id"
    t.index ["user_id"], name: "index_shared_activities_on_user_id"
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
    t.text "token"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "activities", "users"
  add_foreign_key "connections", "users", column: "user_1"
  add_foreign_key "connections", "users", column: "user_2"
  add_foreign_key "events", "activities"
  add_foreign_key "events", "users"
  add_foreign_key "shared_activities", "activities"
  add_foreign_key "shared_activities", "users"
end
