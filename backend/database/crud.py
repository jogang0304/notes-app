import bcrypt
from sqlalchemy.orm import Session

from backend.models import NoteCreate, User, UserCreate

from . import database_models


def get_user(db: Session, user_id: int):
    return (
        db.query(database_models.UserModel)
        .filter(database_models.UserModel.id == user_id)
        .first()
    )


def get_user_by_username(db: Session, username: str):
    return (
        db.query(database_models.UserModel)
        .filter(database_models.UserModel.username == username)
        .first()
    )


def create_user(db: Session, user: UserCreate):
    if get_user_by_username(db, user.username):
        return None
    bytes_password = user.password.encode("utf-8")
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(bytes_password, salt)
    db_user = database_models.UserModel(
        username=user.username, hashed_password=password_hash.decode("utf-8")
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_note_by_id(db: Session, note_id: int):
    return (
        db.query(database_models.NoteModel)
        .filter(database_models.NoteModel.id == note_id)
        .first()
    )


def get_user_notes(db: Session, user: User):
    return (
        db.query(database_models.NoteModel)
        .filter(database_models.NoteModel.owner_id == user.id)
        .all()
    )


def create_note(db: Session, note: NoteCreate, user: User):
    db_item = database_models.NoteModel(**note.model_dump(), owner_id=user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_note(db: Session, note: database_models.NoteModel):
    db.delete(note)
    db.commit()
    return note
