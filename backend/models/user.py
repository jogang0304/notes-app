from pydantic import BaseModel

from .note import Note


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    items: list[Note] = []

    class Config:
        from_attributes = True
