from fastapi import FastAPI
from .database import engine, Base
from .routers import auth_router, notes_router

# Initialize FastAPI
app = FastAPI(title="Task Project API")

# Auto-create tables if Alembic not used
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
app.include_router(notes_router.router, prefix="/notes", tags=["Notes"])

@app.get("/")
def root():
    return {"message": "Backend is running successfully ✅"}