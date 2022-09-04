import models.user
import db.db_setup

models.user.User.create_table()
u = models.user.User("fjhf", "fjhfhf")
u.insert()

# db.db_setup.drop_database()
# db.migrations.asdf()