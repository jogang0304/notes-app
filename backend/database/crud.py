import logging
from sqlalchemy.orm import Session
import os

from . import models, schemas
import bcrypt


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.UserCreate):
    if get_user_by_username(db, user.username):
        return None
    bytes_password = user.password.encode("utf-8")
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(bytes_password, salt)
    db_user = models.User(
        username=user.username, hashed_password=password_hash.decode("utf-8")
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_notes(db: Session, user: schemas.User):
    return db.query(models.Note).filter(models.Note.owner_id == user.id).all()


def create_note(db: Session, note: schemas.NoteCreate, user_id: int):
    db_item = models.Note()(**note.model_dump(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
