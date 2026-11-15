from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    phone: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None = None
    location: str | None = None
    bio: str | None = None

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    phone: str | None = None
    location: str | None = None
    bio: str | None = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"