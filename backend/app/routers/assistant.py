
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.document import Document
from app.models.user import User
from app.services.auth_dependency import get_current_user
from app.services.groq_service import generate_groq_response


router = APIRouter(
    prefix="/assistant",
    tags=["AI Assistant"]
)


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


@router.post("/chat")
def chat_with_assistant(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    question = request.message.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Please enter a message."
        )

    # Fetch only the logged-in user's documents
    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .all()
    )

    # Prepare document information for the AI
    document_details = []

    for document in documents:
        document_details.append({
            "title": document.title,
            "category": document.category,
            "description": document.description,
            "expiry_date": (
                document.expiry_date.isoformat()
                if document.expiry_date else None
            ),
            "status": document.status
        })

    prompt = f"""
You are LifeLedger AI, a helpful personal document management assistant.

Answer the user's question using the document information provided below.

Rules:
1. Use only the information provided about the user's documents.
2. Do not invent document details, dates, or expiry information.
3. If the information is unavailable, clearly say so.
4. Explain answers in simple, clear language.
5. Help the user understand document expiry dates and document status.

User's documents:
{document_details}

User's question:
{question}
"""

    try:
        answer = generate_groq_response(prompt)

        return {
            "reply": answer,
            "conversation_id": request.conversation_id
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="The AI assistant could not generate a response. Please try again."
        )
