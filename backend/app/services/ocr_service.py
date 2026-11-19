
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
    Extract expiry dates from OCR text and PDF text.
    Supports numeric and written date formats.
    """

    if not text:
        return None

    text = text.lower().replace("\r", "\n")

    # Normalise common OCR mistakes in expiry labels
    text = text.replace("expirv", "expiry")
    text = text.replace("expirv date", "expiry date")
    text = text.replace("valid upt0", "valid upto")

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    date_patterns = [
        r"\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b",
        r"\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\b",
        r"\b\d{1,2}\s+[a-z]{3,9}\s+\d{4}\b",
        r"\b[a-z]{3,9}\s+\d{1,2},?\s+\d{4}\b"
    ]

    date_formats = [
        "%d-%m-%Y", "%d/%m/%Y", "%d.%m.%Y",
        "%d-%m-%y", "%d/%m/%y",
        "%Y-%m-%d", "%Y/%m/%d", "%Y.%m.%d",
        "%d %B %Y", "%d %b %Y",
        "%B %d %Y", "%B %d, %Y",
        "%b %d %Y", "%b %d, %Y"
    ]

    keywords = [
    # General expiry terms
    "expiry date",
    "expiration date",
    "expiry",
    "expiration",
    "expires",
    "expires on",
    "date of expiry",
    "date of expiration",
    "expiry dt",
    "exp date",
    "exp. date",

    # Validity terms
    "valid until",
    "valid upto",
    "valid up to",
    "valid till",
    "valid through",
    "validity date",
    "validity period",
    "date valid",
    "valid until date",
    "validity expires",

    # End-date terms
    "end date",
    "policy end date",
    "coverage end date",
    "cover end date",
    "validity end date",
    "date of end",
    "last valid date",

    # Insurance-related terms
    "policy expiry",
    "policy expires",
    "policy expiration",
    "policy period",
    "period of insurance",
    "insurance period",
    "period of coverage",
    "coverage period",
    "risk period",
    "own damage period",
    "third party period",

    # Licence and vehicle documents
    "licence expiry",
    "license expiry",
    "driving licence validity",
    "driving license validity",
    "registration validity",
    "fitness validity",
    "permit validity",
    "insurance validity",

    # Passport and identity documents
    "passport expiry",
    "passport expiration",
    "date of expiry of passport",
    "document expiry",
    "card expiry",

    # Certificates and subscriptions
    "certificate expiry",
    "certificate validity",
    "membership expiry",
    "subscription expiry",
    "subscription ends",
    "renewal date",
    "renew before",
    "renewal due date"
]

    # Search expiry-related lines first
    for index, line in enumerate(lines):
        if any(keyword in line for keyword in keywords):

            nearby_text = " ".join(lines[index:index + 5])

            for pattern in date_patterns:
                dates = re.findall(pattern, nearby_text)

                for date_string in dates:
                    for date_format in date_formats:
                        try:
                            return datetime.strptime(
                                date_string,
                                date_format
                            )
                        except ValueError:
                            continue

    return None