import os
from app.services.auth_dependency import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    UserProfileUpdate
)
from app.services.security import (
    hash_password,
    verify_password,
    create_access_token
)
from datetime import datetime, timedelta

from app.schemas.auth import (
    ForgotPasswordRequest,
    ResetPasswordRequest
)

from app.services.security import (
    create_password_reset_token,
    hash_password_reset_token
)

from app.services.password_reset_service import (
    send_password_reset_email
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered"
        )

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        phone=user_data.phone
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=TokenResponse)
def login_user(user_data: UserLogin, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user or not verify_password(
        user_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    access_token = create_access_token(
        data={"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_my_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.phone = profile_data.phone
    current_user.location = profile_data.location
    current_user.bio = profile_data.bio

    db.commit()
    db.refresh(current_user)

    return current_user

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == request.email
    ).first()

    # Always return the same response to avoid revealing
    # whether an email is registered.
    response = {
        "message": "If the email is registered, a reset link will be sent."
    }

    if user is None:
        return response

    reset_token = create_password_reset_token()

    user.reset_token_hash = hash_password_reset_token(
        reset_token
    )

    # MySQL stores this DateTime without timezone information.
    user.reset_token_expires_at = (
        datetime.utcnow() + timedelta(minutes=15)
    )

    db.commit()

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    ).rstrip("/")

    reset_link = (
        f"{frontend_url}/reset-password?token={reset_token}"
    )

    try:
        send_password_reset_email(
            recipient_email=user.email,
            reset_link=reset_link
        )
    except Exception:
        user.reset_token_hash = None
        user.reset_token_expires_at = None
        db.commit()
        raise HTTPException(
            status_code=500,
            detail="Unable to send password reset email. Please try again."
        )

    return response

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    token_hash = hash_password_reset_token(request.token)

    user = db.query(User).filter(
        User.reset_token_hash == token_hash
    ).first()

    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired password reset link"
        )

    if (
        user.reset_token_expires_at is None
        or datetime.utcnow() > user.reset_token_expires_at
    ):
        user.reset_token_hash = None
        user.reset_token_expires_at = None
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Password reset link has expired"
        )

    user.hashed_password = hash_password(
        request.new_password
    )

    # Invalidate the reset token after successful use
    user.reset_token_hash = None
    user.reset_token_expires_at = None

    db.commit()

    return {
        "message": "Password reset successfully. Please log in with your new password."
    }