from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from database import Base
from datetime import datetime

class UserModel(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True)  # Add unique=True here
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)  # Probably want this unique too

class TodoModel(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)
    user_id = Column(String, ForeignKey("users.uuid"))