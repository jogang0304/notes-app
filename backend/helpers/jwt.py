import datetime
from typing import Optional
import jwt
from os import getenv
from backend.models import Token

class JWTHelper:
    def __init__(self) -> None:
        pass

    @staticmethod
    def create(username: str) -> str:
        secret = getenv("JWT_SECRET")
        token = jwt.encode(
            Token(
                username=username, expires=int(datetime.datetime.now().timestamp()) + 1000
            ).model_dump(),
            secret,
            algorithm="HS256",
        )
        return token

    @staticmethod
    def verify(token: str) -> Optional[Token]:
        secret = getenv("JWT_SECRET")
        data: Optional[Token] = None
        try:
            data = Token(**jwt.decode(token, secret, algorithms=["HS256"]))
        except:
            data = None
        if (data is None) or (data.expires < datetime.datetime.now().timestamp()):
            return None
        return data
