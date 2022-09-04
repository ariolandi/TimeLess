def atomic(func):
    def inner(*args, **kwargs):
        if func(*args, **kwargs) is True:
            session.commit()
        else:
            pass
    return inner