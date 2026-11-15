import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  UploadCloud,
  FileText,
  X,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

import { uploadDocument } from "../services/documentService";
import "../styles/Upload.css";

function Upload() {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("Other");
  const [expiryDate, setExpiryDate] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFiles = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter((file) => {
      const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg"
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not supported. Use PDF, JPG or PNG.`);
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds the 10 MB limit.`);
        return false;
      }

      return true;
    });

    setFiles((previous) => [...previous, ...validFiles]);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setMessage("Please select at least one document.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      for (const file of files) {
        await uploadDocument(file, {
          title: file.name,
          category: category,
          description: "",
          expiry_date: expiryDate || undefined
        });
      }

      setMessage("All documents uploaded successfully!");
      setFiles([]);
      setExpiryDate("");
    } catch (error) {
      console.error("Upload error:", error);

      const errorDetail = error.response?.data?.detail;

let errorMessage = "Document upload failed.";

if (Array.isArray(errorDetail)) {
  errorMessage = errorDetail
    .map((item) => item.msg || JSON.stringify(item))
    .join(", ");
} else if (typeof errorDetail === "object" && errorDetail !== null) {
  errorMessage = JSON.stringify(errorDetail);
} else if (errorDetail) {
  errorMessage = errorDetail;
} else if (error.message) {
  errorMessage = error.message;
}

setMessage(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="upload-page">
      <main className="upload-main">

        <Link to="/documents" className="upload-back">
          <ArrowLeft /> Back to Documents
        </Link>

        <div className="upload-heading">
          <p>DOCUMENT MANAGEMENT</p>
          <h1>Upload Documents</h1>
          <span>
            Securely add your important documents to LifeLedger.
          </span>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>

          <div
            className={`upload-dropzone ${dragging ? "dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
          >
            <div className="upload-icon">
              <UploadCloud />
            </div>

            <h2>Drag and drop your files here</h2>
            <p>or choose files from your device</p>

            <label className="choose-file-button">
              Browse Files

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                hidden
                disabled={uploading}
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>

            <small>
              Supported formats: PDF, JPG, PNG | Maximum size: 10 MB per file
            </small>
          </div>

          {files.length > 0 && (
            <div className="selected-files">
              <h3>Selected Documents ({files.length})</h3>

              {files.map((file, index) => (
                <div
                  className="selected-file"
                  key={`${file.name}-${index}`}
                >
                  <FileText />

                  <div>
                    <strong>{file.name}</strong>
                    <small>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </div>

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => removeFile(index)}
                  >
                    <X />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="upload-details">
            <h2>Document Information</h2>

            <label>Document Category</label>

            <select
              value={category}
              disabled={uploading}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Other</option>
              <option>Certificates</option>
              <option>Insurance</option>
              <option>Invoices</option>
              <option>Warranties</option>
              <option>Identity Proof</option>
              <option>Educational Documents</option>
            </select>

            <label>Expiry Date (Optional)</label>

            <input
              type="date"
              value={expiryDate}
              disabled={uploading}
              onChange={(e) => setExpiryDate(e.target.value)}
            />

            <div className="upload-info-note">
              <CheckCircle />
              <p>
                LifeLedger will use OCR and AI to identify document
                details and suggest expiry dates for your verification.
              </p>
            </div>
          </div>

          {message && (
            <p role="status">{message}</p>
          )}

          <button
            type="submit"
            className="upload-submit"
            disabled={uploading}
          >
            <UploadCloud />
            {uploading ? "Uploading..." : "Upload Documents"}
          </button>

        </form>
      </main>
    </div>
  );
}

export default Upload;