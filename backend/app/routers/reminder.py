from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.document import Document
from app.models.reminder import Reminder
from app.models.user import User
from app.services.auth_dependency import get_current_user

router = APIRouter(
    prefix="/reminders",
    tags=["Reminders"]
)


# Get all reminders belonging to the logged-in user
@router.get("/")
def get_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.expiry_date.isnot(None)
    ).all()

    results = []

    for document in documents:
        reminder = db.query(Reminder).filter(
            Reminder.document_id == document.id,
            Reminder.user_id == current_user.id
        ).first()

        # Create a reminder only if one does not already exist
        if reminder is None:
            reminder = Reminder(
                user_id=current_user.id,
                document_id=document.id,
                completed=False
            )
            db.add(reminder)
            db.flush()

        results.append({
            "id": reminder.id,
            "document_id": document.id,
            "title": document.title,
            "category": document.category,
            "expiry_date": document.expiry_date,
            "completed": reminder.completed
        })

    db.commit()

    return results


# Mark a reminder as completed
@router.patch("/{reminder_id}/complete")
def complete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == current_user.id
    ).first()

    if reminder is None:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    reminder.completed = True

    db.commit()
    db.refresh(reminder)

    return {
        "message": "Reminder marked as completed",
        "id": reminder.id,
        "completed": reminder.completed
    }


# Mark a reminder as pending again
@router.patch("/{reminder_id}/pending")
def pending_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == current_user.id
    ).first()

    if reminder is None:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    reminder.completed = False

    db.commit()
    db.refresh(reminder)

    return {
        "message": "Reminder marked as pending",
        "id": reminder.id,
        "completed": reminder.completed
    }