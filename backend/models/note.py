from pydantic import BaseModel


class NoteBase(BaseModel):
    title: str
    text: str = ""


class NoteCreate(NoteBase):
    pass


class Note(NoteBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
