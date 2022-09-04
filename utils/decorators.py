from db.db_connection import session


def atomic(func):
    def inner(*args, **kwargs):
        if func(*args, **kwargs) is True:
            session.commit()
        else:
            pass
    return inner
