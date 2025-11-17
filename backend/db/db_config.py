from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

Base = declarative_base()

class Database:
    def __init__(self, url=None):
        self.url = url or 'sqlite:///./fincoach.db'
        self.engine = create_engine(self.url, connect_args={"check_same_thread": False} if 'sqlite' in self.url else {})
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        # create tables
        from . import orm_models
        Base.metadata.create_all(bind=self.engine)

    def get_session(self):
        return self.SessionLocal()

    def get_engine(self):
        return self.engine
