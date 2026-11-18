
import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq

# Load the backend environment variables
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


def generate_groq_response(prompt: str) -> str:
    """
    Send a user's question to Groq and return the AI response.
    """

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("Groq API key is missing from backend/.env")

    client = Groq(api_key=api_key)

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return (
        response.choices[0].message.content
        or "Groq could not generate a response."
    )
