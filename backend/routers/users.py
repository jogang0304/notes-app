from typing import Annotated

from fastapi import APIRouter, Depends, Form, HTTPException

import backend.database as database
from backend.helpers.jwt import JWTHelper

router = APIRouter()


@router.get("/")
async def read_root():
    return {"Hello": "World"}


@router.post("/register/", response_model=str)
async def register_user(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    db: database.Session = Depends(database.get_db),
):
    db_user = await database.create_user(username, password, db)
    if not db_user:
        raise HTTPException(status_code=400, detail="User already exists")
    token = JWTHelper.create(username)
    return token


@router.post("/login/", response_model=str)
async def login_user(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    db: database.Session = Depends(database.get_db),
):
    db_user = await database.verify_user(username, password, db)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = JWTHelper.create(username)
    return token


@router.post("/renew/", response_model=str)
async def renew_token(token: Annotated[str, Form()]):
    try:
        token_data = JWTHelper.verify(token)
    except:
        raise HTTPException(status_code=400, detail="Invalid token")
    if token_data is None:
        raise HTTPException(status_code=400, detail="Invalid token")
    new_token = JWTHelper.create(token_data.username)
    return new_token
