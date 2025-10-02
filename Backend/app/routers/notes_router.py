from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud
from ..database import get_db
from ..deps import get_current_user

router = APIRouter()


# 🔹 Get all notes for the logged-in user
@router.get("/")
def get_notes(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    try:
        notes = crud.get_notes_for_user(db, current_user.id)
        return {
            "success": True,
            "message": "Notes fetched successfully",
            "data": notes
        }
    except Exception as e:
        return {
            "success": False,
            "error_code": 1001,
            "message": str(e)
        }


# 🔹 Create a new note
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_note(note_in: schemas.NoteCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    try:
        note = crud.create_note(db, note_in, current_user.id)
        return {
            "success": True,
            "message": "Note created successfully",
            "data": note
        }
    except Exception as e:
        return {
            "success": False,
            "error_code": 1002,
            "message": str(e)
        }


# 🔹 Get a single note by ID
@router.get("/{note_id}")
def get_note(note_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    note = crud.get_note(db, note_id)
    if not note or note.owner_id != current_user.id:
        return {
            "success": False,
            "error_code": 1003,
            "message": "Note not found"
        }
    return {
        "success": True,
        "message": "Note fetched successfully",
        "data": note
    }


# 🔹 Update a note by ID
@router.put("/{note_id}")
def update_note(note_id: int, note_in: schemas.NoteCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    note = crud.get_note(db, note_id)
    if not note or note.owner_id != current_user.id:
        return {
            "success": False,
            "error_code": 1004,
            "message": "Note not found"
        }
    updated = crud.update_note(db, note, note_in)
    return {
        "success": True,
        "message": "Note updated successfully",
        "data": updated
    }


# 🔹 Delete a note
@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    note = crud.get_note(db, note_id)
    if not note or note.owner_id != current_user.id:
        return {
            "success": False,
            "error_code": 1005,
            "message": "Note not found"
        }
    crud.delete_note(db, note)
    return {
        "success": True,
        "message": "Note deleted successfully"
    }
