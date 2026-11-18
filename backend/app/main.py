
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from app.database.connection import engine, Base, SessionLocal

# Database models
from app.models.user import User
from app.models.document import Document
from app.models.reminder import Reminder
from app.models.notification import Notification

# API routers
from app.routers.auth import router as auth_router
from app.routers.documents import router as documents_router
from app.routers.reminder import router as reminders_router
from app.routers.notification import (
    router as notifications_router,
    generate_expiry_notifications
)
from app.routers.assistant import router as assistant_router


# Create database tables
Base.metadata.create_all(bind=engine)


# Create scheduler
scheduler = BackgroundScheduler(
    timezone="Asia/Kolkata"
)


# Automatic expiry checking function
def automatic_expiry_check():

    db = SessionLocal()

    try:
        created_count = generate_expiry_notifications(db)

        print(
            f"Automatic expiry check completed. "
            f"Notifications created: {created_count}"
        )

    except Exception as error:
        db.rollback()
        print("Automatic expiry check failed:", error)

    finally:
        db.close()


# Start and stop scheduler with FastAPI
@asynccontextmanager
async def lifespan(app: FastAPI):

    scheduler.add_job(
        automatic_expiry_check,
        trigger=CronTrigger(
            hour=8,
            minute=0,
            timezone="Asia/Kolkata"
        ),
        id="daily_expiry_check",
        replace_existing=True
    )

    scheduler.start()

    print("LifeLedger daily expiry scheduler started.")

    yield

    scheduler.shutdown(wait=False)

    print("LifeLedger expiry scheduler stopped.")


# Create FastAPI application
app = FastAPI(
    title="LifeLedger API",
    description="Smart Personal Document Management System",
    version="1.0.0",
    lifespan=lifespan
)


# CORS configuration
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost",
    "http://127.0.0.1"
]

# Add public frontend URL when configured
public_frontend_url = os.getenv("FRONTEND_URL")

if public_frontend_url:
    allowed_origins.append(public_frontend_url.rstrip("/"))


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routers
app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(reminders_router)
app.include_router(notifications_router)
app.include_router(assistant_router)


# Root endpoint
@app.get("/")
def root():
    return {
        "message": "LifeLedger API is running successfully"
    }


# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# Scheduler status endpoint
@app.get("/scheduler-status")
def scheduler_status():

    return {
        "scheduler_running": scheduler.running,
        "job": "Daily document expiry check",
        "scheduled_time": "Every day at 08:00 AM",
        "timezone": "Asia/Kolkata"
    }
