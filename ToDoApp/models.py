from datetime import datetime

from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, Boolean, func, ForeignKey, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship



class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(250), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)

    user_lists: Mapped[list['ToDoList']] = relationship(back_populates='user', cascade='all, delete-orphan', lazy='selectin')

    def __repr__(self):
        return f"<User {self.email!r}>"


class ToDoList(db.Model):
    __tablename__ = 'to_do_lists'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime]= mapped_column(DateTime, onupdate=func.now())

    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    user: Mapped['User'] = relationship(back_populates='user_lists')

    items: Mapped[list['ToDoItem']] = relationship(back_populates='to_do_list', cascade='all, delete-orphan', lazy='selectin')

    def __repr__(self):
        return f"<ToDoList {self.title!r} (user_id={self.user_id})>"

class ToDoItem(db.Model):
    __tablename__ = 'to_do_items'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    is_favourite: Mapped[bool] = mapped_column(Boolean, default=False)
    is_important: Mapped[bool] = mapped_column(Boolean, default=False)
    is_done: Mapped[bool] = mapped_column(Boolean, default=False)
    details: Mapped[str | None] = mapped_column(String(255), nullable=True, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime]= mapped_column(DateTime, onupdate=func.now())
    due_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, default=None)

    to_do_list_id: Mapped[int] = mapped_column(ForeignKey('to_do_lists.id'), nullable=False)
    to_do_list: Mapped['ToDoList'] = relationship(back_populates='items', lazy='joined')

    def __repr__(self):
        return f"<ToDoItem {self.title!r} (due={self.due_date}) in list_id={self.to_do_list_id}>"


