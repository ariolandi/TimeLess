from db.db_connection import Base, session, engine
from sqlalchemy import Column, Integer, String, inspect
from utils.helpers import hash
from utils.decorators import atomic


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True)
    password = Column(String)

    def __init__(self, username, password):
        self.username = username
        self.password = str(hash(password, username))

    def __str__(self):
        return self.username

    def __repr__(self):
        return str(self)

    def __eq__(self, other):
        return self.username == other.username and\
            self.password == other.password

    # Database methods
    @classmethod
    @atomic
    def create_table(cls):
        if not inspect(engine).has_table(cls.__tablename__):
            cls.__table__.create(engine)

    @classmethod
    @atomic
    def delete_table(cls):
        cls.__table__.drop(engine)

    @classmethod
    def select_by_id(cls, id):
        return session.query(cls).filter(cls.id == id).one()

    def select(self):
        return User.select_by_id(self.id)

    @classmethod
    def select_by_username(cls, username):
        return session.query(cls).filter(cls.username == username).one()

    @atomic
    def insert(self):
        session.add(self)

    @atomic
    def delete(self):
        self.select().delete()
