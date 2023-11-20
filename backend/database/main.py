from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine
import bcrypt

models.Base.metadata.create_all(bind=engine)


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
    to_create = schemas.UserCreate(username=username, password=password)
    db_user = crud.create_user(db, to_create)
    return db_user