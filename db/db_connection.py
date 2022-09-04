from sqlalchemy.ext.declarative import declarative_base, DeclarativeMeta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from abc import ABCMeta, abstractclassmethod, abstractmethod


class DeclarativeABCMeta(DeclarativeMeta, ABCMeta):
    pass


# We need this override in order to make sure all classes
# have the needed abstract methods
class Base(declarative_base(metaclass=DeclarativeABCMeta)):
    __abstract__ = True

    @abstractclassmethod
    def create_table(cls):
        pass

    @abstractclassmethod
    def delete_table(cls):
        pass

    @abstractmethod
    def insert(self):
        pass
 
    @abstractclassmethod
    def select_by_id(cls, id):
        pass

    @abstractmethod
    def select(self):
        pass

    @abstractmethod
    def delete(self):
        pass


engine = create_engine("sqlite:///timeless.db")

session = sessionmaker(bind=engine)()

Base.metadata.create_all(engine)

session.commit()
