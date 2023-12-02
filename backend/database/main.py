import bcrypt
from sqlalchemy.orm import Session

from backend.models import Note, NoteCreate, UserCreate

from . import crud, database_models
from .database import SessionLocal, engine

database_models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def verify_user(username: str, password: str, db: Session):
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        return False
    if not bcrypt.checkpw(
        password.encode("utf-8"), db_user.hashed_password.encode("utf-8")
    ):
        return False
    return db_user


async def create_user(username: str, password: str, db: Session):
    to_create = UserCreate(username=username, password=password)
    db_user = crud.create_user(db, to_create)
    return db_user


async def get_note(note_id: int, username: str, db: Session):
    db_note = crud.get_note_by_id(db, note_id)
    if db_note is None:
        return None
    if db_note.owner.username != username:
        return None
    return db_note


async def get_user_notes(username: str, db: Session):
    db_user_notes = crud.get_user_notes(db, crud.get_user_by_username(db, username))
    return db_user_notes


async def create_note(username: str, title: str, text: str, db: Session):
    db_user = crud.get_user_by_username(db, username)
    if db_user is None:
        return None
    db_note = crud.create_note(db, NoteCreate(title=title, text=text), db_user)
    return db_note


async def delete_note(note_id: int, username: str, db: Session):
    db_note = crud.get_note_by_id(db, note_id)
    if db_note is None:
        return None
    if db_note.owner.username != username:
        return None
    return crud.delete_note(db, db_note)


async def change_note(note: Note, username: str, db: Session):
    db_note = crud.get_note_by_id(db, note.id)
    if db_note is None or db_note.owner.username != username:
        return None
    db_user = crud.get_user_by_username(db, username)
    if db_user is None or note.owner_id != db_user.id:
        return None
    return crud.change_note(db, note, db_user)
