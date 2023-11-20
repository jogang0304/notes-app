from pydantic import BaseModel


class Token(BaseModel):
    username: str
    expires: int
