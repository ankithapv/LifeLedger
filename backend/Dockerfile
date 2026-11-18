
FROM python:3.13-slim

# Install Tesseract OCR and required system libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python dependencies
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY app ./app

# Copy TiDB certificate
COPY certs ./certs

# Create uploads directory
RUN mkdir -p /app/uploads

# Set Tesseract executable for Linux
ENV TESSERACT_CMD=/usr/bin/tesseract

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
