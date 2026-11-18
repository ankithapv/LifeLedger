
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.document import Document
from app.models.notification import Notification
from app.models.user import User
from app.services.auth_dependency import get_current_user
from app.services.email_service import send_expiry_email


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# Generate expiry notifications and send emails
def generate_expiry_notifications(db: Session, user_id=None):

    query = db.query(Document).filter(
        Document.expiry_date.isnot(None)
    )

    if user_id is not None:
        query = query.filter(Document.user_id == user_id)

    documents = query.all()

    today = date.today()
    created_count = 0

    for document in documents:

        expiry_date = document.expiry_date.date()
        days_remaining = (expiry_date - today).days

        notification_type = None
        message = None

        if days_remaining == 30:
            notification_type = "30_days"
            message = f"{document.title} expires in 30 days."

        elif days_remaining == 15:
            notification_type = "15_days"
            message = f"{document.title} expires in 15 days."

        elif days_remaining == 7:
            notification_type = "7_days"
            message = f"{document.title} expires in 7 days."

        elif days_remaining == 1:
            notification_type = "1_day"
            message = f"{document.title} expires tomorrow."

        elif days_remaining == 0:
            notification_type = "expires_today"
            message = f"{document.title} expires today."

        elif days_remaining < 0:
            notification_type = "expired"
            message = f"{document.title} has expired."

        if notification_type is None:
            continue

        # Check whether the in-app notification already exists
        notification = db.query(Notification).filter(
            Notification.user_id == document.user_id,
            Notification.document_id == document.id,
            Notification.notification_type == notification_type,
            Notification.expiry_date == document.expiry_date
        ).first()

        # Create notification only if it does not exist
        if notification is None:

            notification = Notification(
                user_id=document.user_id,
                document_id=document.id,
                title="Document Expiry Alert",
                message=message,
                notification_type=notification_type,
                expiry_date=document.expiry_date,
                is_read=False,
                email_sent=False
            )

            db.add(notification)
            created_count += 1

        # Check whether the document owner's email exists
        user = db.query(User).filter(
            User.id == document.user_id
        ).first()

        if user is None or not user.email:
            print(
                f"No email address found for user ID {document.user_id}"
            )
            continue

        # Send email only if it has not already been sent
        if not notification.email_sent:

            try:
                send_expiry_email(
                    recipient_email=user.email,
                    document_title=document.title,
                    expiry_date=document.expiry_date.strftime("%d %B %Y"),
                    days_remaining=days_remaining
                )

                # Mark email as sent only after successful delivery
                notification.email_sent = True

                print(
                    f"Expiry email sent successfully to {user.email}"
                )

            except Exception as error:

                notification.email_sent = False

                print(
                    f"Failed to send expiry email to {user.email}: {error}"
                )

    db.commit()

    return created_count


# Manual expiry check through Swagger
@router.post("/check-expiry")
def check_expiry(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    created_count = generate_expiry_notifications(
        db,
        current_user.id
    )

    return {
        "message": "Expiry check completed",
        "notifications_created": created_count
    }


# Get all notifications
@router.get("/")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(
        Notification.created_at.desc()
    ).all()

    return notifications


# Get unread notification count
@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()

    return {
        "unread_count": count
    }


# Mark notification as read
@router.patch("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()

    if notification is None:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return {
        "message": "Notification marked as read",
        "id": notification.id,
        "is_read": notification.is_read
    }

