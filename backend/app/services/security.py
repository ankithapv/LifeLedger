import secrets
from datetime import datetime, timedelta, timezone
import os


import jwt
from pwdlib import PasswordHash
from dotenv import load_dotenv
from pathlib import Path
import hashlib

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY is missing from .env file")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_password_reset_token() -> str:
    return secrets.token_urlsafe(32)


def verify_password_reset_token(
    token_created_at: datetime
) -> bool:

    if token_created_at is None:
        return False

    expiry_time = token_created_at + timedelta(minutes=15)

    return datetime.now(timezone.utc) < expiry_time.replace(
        tzinfo=timezone.utc
    )

def hash_password_reset_token(token: str) -> str:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()