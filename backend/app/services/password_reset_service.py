import os
import smtplib

from email.message import EmailMessage
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


def send_password_reset_email(
    recipient_email: str,
    reset_link: str
):
    sender_email = os.getenv("MAIL_USERNAME")
    sender_password = os.getenv("MAIL_PASSWORD")

    if not sender_email or not sender_password:
        raise ValueError("Email configuration is missing")

    message = EmailMessage()

    message["Subject"] = "LifeLedger - Reset Your Password"
    message["From"] = sender_email
    message["To"] = recipient_email

    message.set_content(
        f"""
Hello,

We received a request to reset your LifeLedger password.

Click the link below to create a new password:

{reset_link}

This link is valid for 15 minutes.

If you did not request a password reset, please ignore this email.

Regards,
LifeLedger Team
"""
    )

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, sender_password)
        server.send_message(message)