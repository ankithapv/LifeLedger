from pydantic import BaseModel, Field
from datetime import datetime


class DocumentResponse(BaseModel):
    id: int
    user_id: int
    title: str
    original_filename: str
    category: str
    description: str | None = None
    file_type: str | None = None
    file_size: int | None = None
    expiry_date: datetime | None = None
    status: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class DocumentUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    category: str | None = Field(default=None, max_length=100)
    description: str | None = None
    expiry_date: datetime | None = None
    status: str | None = None