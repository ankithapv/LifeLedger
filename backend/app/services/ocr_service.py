
import os
import pytesseract
from PIL import Image
import fitz
from pathlib import Path
import re
from datetime import datetime

# Connect Python to Tesseract OCR.
# Windows uses the existing installation.
# Docker uses the Linux installation.
pytesseract.pytesseract.tesseract_cmd = os.getenv(
    "TESSERACT_CMD",
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def extract_text_from_document(file_path: str) -> str:
    """
    Extract text from images and PDFs.
    First tries direct PDF text extraction.
    Uses OCR only when PDF text is unavailable.
    """

    extension = Path(file_path).suffix.lower()

    if extension in [".png", ".jpg", ".jpeg"]:
        with Image.open(file_path) as image:
            return pytesseract.image_to_string(image)

    elif extension == ".pdf":
        pdf = fitz.open(file_path)
        extracted_text = ""

        try:
            for page in pdf:
                page_text = page.get_text("text")

                if page_text.strip():
                    extracted_text += page_text + "\n"
                else:
                    # Lower resolution for faster OCR
                    pix = page.get_pixmap(dpi=200, alpha=False)

                    image = Image.frombytes(
                        "RGB",
                        [pix.width, pix.height],
                        pix.samples
                    )

                    page_text = pytesseract.image_to_string(image)
                    extracted_text += page_text + "\n"

        finally:
            pdf.close()

        return extracted_text

    return ""


def extract_expiry_date(text: str):
    """
    Extract expiry dates in numeric and written formats.
    """

    if not text:
        return None

    text = text.lower().replace("\r", "\n")

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    date_patterns = [
        r"\b\d{1,2}[-/.]\d{1,2}[-/.]\d{4}\b",
        r"\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\b",
        r"\b\d{1,2}\s+[a-z]+\s+\d{4}\b",
        r"\b[a-z]+\s+\d{1,2},?\s+\d{4}\b"
    ]

    date_formats = [
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%d.%m.%Y",
        "%Y-%m-%d",
        "%Y/%m/%d",
        "%Y.%m.%d",
        "%d %B %Y",
        "%d %b %Y",
        "%B %d %Y",
        "%B %d, %Y",
        "%b %d %Y",
        "%b %d, %Y"
    ]

    keywords = [
        "expiry date",
        "expiration date",
        "expiry",
        "expiration",
        "valid until",
        "valid upto",
        "valid up to",
        "date of expiry",
        "expires on",
        "expiry dt"
    ]

    # First check lines containing expiry keywords
    for index, line in enumerate(lines):
        if any(keyword in line for keyword in keywords):
            nearby_text = " ".join(lines[index:index + 3])

            for pattern in date_patterns:
                dates = re.findall(pattern, nearby_text)

                for date in dates:
                    for date_format in date_formats:
                        try:
                            return datetime.strptime(
                                date,
                                date_format
                            )
                        except ValueError:
                            continue

    return None
