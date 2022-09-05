from db.db_connection import session
from models.user import User

models = [User]


def setup(classname):
    classname.create_table()


def drop(classname):
    classname.delete_table()


def setup_database():
    for model in models:
        setup(model)
    session.commit()


def drop_database():
    for model in models:
        drop(model)
    session.commit()


def reset_database():
    drop_database()
    setup_database()


setup_database()
