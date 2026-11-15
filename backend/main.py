from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine, Base
from app.models.user import User
from app.models.document import Document
from app.routers.auth import router as auth_router
from app.routers.documents import router as documents_router
from app.models.reminder import Reminder
from app.routers.reminder import router as reminders_router


app = FastAPI(
    title="LifeLedger API",
    description="Smart Personal Document Management System",
    version="1.0.0"
)

# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Register authentication routes
app.include_router(auth_router)

# Register document routes
app.include_router(documents_router)
app.include_router(reminders_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to LifeLedger API!",
        "status": "Backend is running successfully"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected"
    }