
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    UniqueConstraint
)
from sqlalchemy.sql import func

from app.database.connection import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    document_id = Column(
        Integer,
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    title = Column(
        String(200),
        nullable=False
    )

    message = Column(
        String(500),
        nullable=False
    )

    notification_type = Column(
        String(50),
        nullable=False
    )

    is_read = Column(
        Boolean,
        default=False,
        nullable=False
    )

    email_sent = Column(
        Boolean,
        default=False,
        nullable=False
    )

    expiry_date = Column(
        DateTime,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "document_id",
            "notification_type",
            "expiry_date",
            name="unique_document_notification"
        ),
    )
