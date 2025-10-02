# backend/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from datetime import datetime
from .auth import get_password_hash, verify_password


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Users
# ✅ Create new user
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ✅ Get user by email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# ✅ Authenticate user
def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# Notes


def create_note(db: Session, note_in: schemas.NoteCreate, owner_id: int):
    note = models.Note(title=note_in.title, content=note_in.content, owner_id=owner_id)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note




def get_notes_for_user(db: Session, owner_id: int):
    return db.query(models.Note).filter(models.Note.owner_id == owner_id).all()




def get_note(db: Session, note_id: int):
    return db.query(models.Note).filter(models.Note.id == note_id).first()




def update_note(db: Session, db_note: models.Note, note_in: schemas.NoteCreate):
    db_note.title = note_in.title
    db_note.content = note_in.content
    db.commit()
    db.refresh(db_note)
    return db_note




def delete_note(db: Session, db_note: models.Note):
    db.delete(db_note)
    db.commit()
    return True