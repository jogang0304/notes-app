import token
from typing import Optional, Annotated
from fastapi import APIRouter, Depends, Form
from pydantic import BaseModel
from backend.database.schemas import UserCreate

from backend.helpers.jwt import JWTHelper
from backend.database import *

from backend.models import *

router = APIRouter()


@router.get("/")
async def read_root():
    return {"Hello": "World"}


@router.post("/register/")
async def register_user(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    db: Session = Depends(get_db),
):
    db_user = await create_user(username, password, db)
    if not db_user:
        return {"error": "User already exists"}
    token = JWTHelper.create(username)
    return token


@router.post("/login/")
async def login_user(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    db: Session = Depends(get_db),
):
    db_user = await verify_user(username, password, db)
    if not db_user:
        return {"error": "Invalid Credentials"}
    token = JWTHelper.create(username)
    return {"success": token}


@router.post("/renew/")
async def renew_token(token: Annotated[str, Form()]):
    try:
        token_data = JWTHelper.verify(token)
    except:
        return {"error": "Invalid Token"}
    if token_data is None:
        return {"error": "Invalid Token"}
    new_token = JWTHelper.create(token_data.username)
    return {"success": new_token}
