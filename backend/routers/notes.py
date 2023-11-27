import json
from typing import Annotated

from fastapi import APIRouter, Depends, Form, Header, HTTPException

import backend.database as database
from backend.helpers.jwt import JWTHelper
from backend.models import Note

router = APIRouter()


@router.get("/")
async def read_root():
    return {"Hello": "World"}


@router.post("/get/", response_model=Note)
async def get_node_by_id(
    token: Annotated[str, Header()],
    id: Annotated[int, Form()],
    db: database.Session = Depends(database.get_db),
):
    verified_token = JWTHelper().verify(token)
    if verified_token is None:
        raise HTTPException(status_code=400, detail="Invalid token")
    note = await database.get_note(id, verified_token.username, db)
    if note is None:
        raise HTTPException(status_code=404, detail="Invalid id or username")
    return note


@router.post("/user/", response_model=list[int])
async def get_user_notes(
    token: Annotated[str, Header()],
    db: database.Session = Depends(database.get_db),
):
    verified_token = JWTHelper().verify(token)
    if verified_token is None:
        raise HTTPException(status_code=400, detail="Invalid token")
    notes = await database.get_user_notes(verified_token.username, db)
    if notes is None:
        raise HTTPException(status_code=400, detail="Invalid username")
    return [note.id for note in notes]


@router.post("/create/", response_model=Note)
async def create_note(
    token: Annotated[str, Header()],
    title: Annotated[str, Form()],
    text: Annotated[str, Form()],
    db: database.Session = Depends(database.get_db),
):
    verified_token = JWTHelper().verify(token)
    if verified_token is None:
        raise HTTPException(status_code=400, detail="Invalid token")
    note = await database.create_note(verified_token.username, title, text, db)
    if note is None:
        raise HTTPException(status_code=400, detail="Invalid username")
    return note


@router.post("/delete/", response_model=Note)
async def delete_note(
    token: Annotated[str, Header()],
    id: Annotated[int, Form()],
    db: database.Session = Depends(database.get_db),
):
    verified_token = JWTHelper().verify(token)
    if verified_token is None:
        raise HTTPException(status_code=400, detail="Invalid token")
    note = await database.delete_note(id, verified_token.username, db)
    if note is None:
        raise HTTPException(status_code=404, detail="Invalid id or username")
    return note


@router.post("/change/", response_model=Note)
async def change_note(
    token: Annotated[str, Header()],
    note_json: Annotated[str, Form()],
    db: database.Session = Depends(database.get_db),
):
    verified_token = JWTHelper().verify(token)
    if verified_token is None:
        raise HTTPException(status_code=400, detail="Invalid token")
    try:
        note = Note(**json.loads(note_json))
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid json") from None
    except:
        raise HTTPException(
            status_code=400, detail="Unknown error changing note"
        ) from None
    changed_note = await database.change_note(
        note,
        verified_token.username,
        db,
    )
    if changed_note is None:
        raise HTTPException(status_code=404, detail="Invalid note id or username")
    return changed_note
