
import os
import smtplib

from pathlib import Path
from email.message import EmailMessage
from dotenv import load_dotenv


# Load settings from backend/.env
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")


def send_expiry_email(
    recipient_email,
    document_title,
    expiry_date,
    days_remaining
):

    if not MAIL_USERNAME or not MAIL_PASSWORD or not MAIL_FROM:
        raise ValueError("Gmail settings are missing in .env")

    message = EmailMessage()

    message["Subject"] = (
        f"LifeLedger: {document_title} expiry reminder"
    )

    message["From"] = MAIL_FROM
    message["To"] = recipient_email

    if days_remaining == 0:
        reminder_text = "expires today"
    elif days_remaining == 1:
        reminder_text = "expires tomorrow"
    else:
        reminder_text = f"expires in {days_remaining} days"

    message.set_content(
        f"""
Hello,

This is a reminder from LifeLedger.

Your document "{document_title}" {reminder_text}.

Expiry date: {expiry_date}

Please renew your document before it expires.

Regards,
LifeLedger Team
"""
    )

    # Connect using port 587 and secure STARTTLS
    with smtplib.SMTP(
        "smtp.gmail.com", 587, timeout=30
    ) as server:

        server.ehlo()
        server.starttls()
        server.ehlo()

        server.login(MAIL_USERNAME, MAIL_PASSWORD)

        server.send_message(message)

    print(f"Email sent successfully to {recipient_email}")

    return True
