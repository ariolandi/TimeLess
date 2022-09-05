from sqlalchemy.exc import IntegrityError, NoResultFound
from models.user import User


class UserController:
    @classmethod
    def register(cls, new_user):
        try:
            new_user.insert()
        except IntegrityError:
            raise ValueError("This user is already registered!")

    @classmethod
    def authenticate(cls, user):
        try:
            potential_user = User.select_by_username(user.username)
            if user != potential_user:
                raise ValueError("Incorrect password! Please try again!")
        except NoResultFound:
            raise ValueError("User not found!")
