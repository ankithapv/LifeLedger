
import os
from uuid import uuid4
from pathlib import Path
from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    status
)
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse

from app.database.connection import get_db
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentResponse, DocumentUpdate
from app.services.auth_dependency import get_current_user

# OCR functions for automatic text and expiry-date extraction
from app.services.ocr_service import (
    extract_text_from_document,
    extract_expiry_date
)


router = APIRouter(prefix="/documents", tags=["Documents"])


BASE_DIR = Path(__file__).resolve().parents[2]
UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".doc",
    ".docx",
    ".txt"
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# GET ALL DOCUMENTS
@router.get("/", response_model=list[DocumentResponse])
def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
        .all()
    )

    return documents


# UPLOAD DOCUMENT
@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED
)
def upload_document(
    title: str = Form(...),
    category: str = Form("Other"),
    description: str = Form(""),
    expiry_date: str | None = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    extension = Path(file.filename or "").suffix.lower()

    # Check file format
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format"
        )

    file_id = str(uuid4())
    saved_filename = f"{file_id}{extension}"
    file_path = UPLOAD_DIR / saved_filename

    file_size = 0

    try:
        # Save uploaded document
        with file_path.open("wb") as buffer:
            while chunk := file.file.read(1024 * 1024):
                file_size += len(chunk)

                if file_size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail="File size exceeds 10 MB limit"
                    )

                buffer.write(chunk)

        if file_size == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )

        # Expiry date detection
        parsed_expiry = None

        # Manual expiry date has first priority
        if expiry_date and expiry_date.strip():
            try:
                parsed_expiry = datetime.strptime(
                    expiry_date.strip(),
                    "%Y-%m-%d"
                )
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail="Expiry date must use YYYY-MM-DD format"
                )

        # Automatically extract expiry date from PDF and images
        elif extension in [".pdf", ".png", ".jpg", ".jpeg"]:

            extracted_text = extract_text_from_document(
                str(file_path)
            )

            parsed_expiry = extract_expiry_date(
                extracted_text
            )

        # Create database record
        document = Document(
            user_id=current_user.id,
            title=title,
            original_filename=file.filename or saved_filename,
            file_path=str(file_path),
            category=category,
            description=description,
            file_type=file.content_type,
            file_size=file_size,
            expiry_date=parsed_expiry,
            status="Active"
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        # Automatically generate expiry notifications after upload
        try:
            from app.routers.notification import generate_expiry_notifications

            notification_count = generate_expiry_notifications(
                db,
                current_user.id
            )

            print(
                f"Upload completed. Notifications created: {notification_count}"
            )

        except Exception as error:
            print(
                f"Automatic expiry notification failed: {error}"
            )

        return document

    except Exception:
        db.rollback()

        if file_path.exists():
            file_path.unlink()

        raise

    finally:
        file.file.close()


# DELETE DOCUMENT
@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    file_path = Path(document.file_path)

    db.delete(document)
    db.commit()

    if file_path.exists():
        file_path.unlink()

    return {
        "message": "Document deleted successfully"
    }


# VIEW DOCUMENT
@router.get("/{document_id}/view")
def view_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    file_path = Path(document.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Document file not found"
        )

    return FileResponse(
        path=file_path,
        media_type=document.file_type or "application/octet-stream",
        filename=document.original_filename,
        content_disposition_type="inline"
    )


# DOWNLOAD DOCUMENT
@router.get("/{document_id}/download")
def download_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    if not os.path.isfile(document.file_path):
        raise HTTPException(
            status_code=404,
            detail="Document file not found"
        )

    return FileResponse(
        path=document.file_path,
        filename=document.original_filename,
        media_type="application/octet-stream"
    )


# GET SINGLE DOCUMENT
@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return document


# UPDATE DOCUMENT
@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    document_data: DocumentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    update_data = document_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(document, key, value)

    db.commit()
    db.refresh(document)

    return document
