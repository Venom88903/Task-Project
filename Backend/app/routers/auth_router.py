from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db
from ..auth import create_access_token

router = APIRouter()


# ✅ Register endpoint
@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if email already exists
        existing = crud.get_user_by_email(db, user.email)
        if existing:
            return {
                "success": False,
                "error_code": 1001,
                "message": "Email already registered"
            }

        # Create new user
        new_user = crud.create_user(db, user)
        return {
            "success": True,
            "message": "User registered successfully",
            "data": new_user
        }

    except Exception as e:
        return {
            "success": False,
            "error_code": 1002,
            "message": str(e)
        }


# ✅ Login endpoint
@router.post('/login')
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    try:
        # Check if user exists
        db_user = crud.get_user_by_email(db, user.email)
        if not db_user:
            return {
                "success": False,
                "error_code": 1003,
                "message": "Email not registered. Please register first."
            }

        # Verify password
        if not crud.verify_password(user.password, db_user.hashed_password):
            return {
                "success": False,
                "error_code": 1004,
                "message": "Incorrect password"
            }

        # Create access token
        access_token = create_access_token({'sub': str(db_user.id)})
        return {
            "success": True,
            "message": "Login successful",
            "data": {
                "access_token": access_token,
                "token_type": "bearer"
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error_code": 1005,
            "message": str(e)
        }
