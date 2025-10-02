# backend/app/schemas.py
from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=6, max_length=72)

    class Config:
        from_attributes = True  # ✅ Pydantic v2 compatible

class UserLogin(BaseModel):
    email: EmailStr
    password: constr(min_length=6, max_length=72)


class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int]


class NoteCreate(BaseModel):
    title: str
    content: Optional[str] = None


class NoteOut(BaseModel):
    id: int
    title: str
    content: Optional[str]
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
