from models.user import User
from controllers.user_controller import UserController
from utils import constants


def register_new_user():
    new_user = User.read_user()
    try:
        UserController.register(new_user)
    except ValueError as e:
        print(repr(e))
    else:
        print('User successfully registered!')


def login():
    user = User.read_user()
    try:
        UserController.authenticate(user)
        constants.CURRENT_USER = user
    except ValueError as e:
        print(repr(e))
    else:
        print("Login success!")
