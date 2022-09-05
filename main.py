from models.user import User
import db.db_setup
from app import user_login


x = int(input("Hello! please choose a direction:\n1. register a new user\n2. login\n> "))
if x == 1:
    user_login.register_new_user()
elif x == 2:
    user_login.login()
