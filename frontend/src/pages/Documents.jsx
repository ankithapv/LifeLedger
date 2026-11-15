import React, { useState, useEffect , useMemo} from "react";
import {
  getDocuments,
  deleteDocument,
  viewDocument,
  downloadDocument
} from "../services/documentService";
import { Link } from "react-router-dom";
import {
  FileText,
  Search,
  UploadCloud,
  Filter,
  Eye,
  Download,
  Trash2,
  CalendarDays,
  FolderOpen,
  X
} from "lucide-react";

import "../styles/Documents.css";

function Documents() {
  // Empty initially. Real documents will come from the backend later.
  const [documents, setDocuments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDocument, setSelectedDocument] = useState(null);
   // Fetch documents from the backend
useEffect(() => {
  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();

 const formattedDocuments = data.map((doc) => {
  let calculatedStatus = "Active";

  if (doc.expiry_date) {
    const expiryString = String(doc.expiry_date).slice(0, 10);
    const [year, month, day] = expiryString.split("-").map(Number);

    if (year && month && day) {
      const expiry = Date.UTC(year, month - 1, day);

      const todayDate = new Date();
      const today = Date.UTC(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate()
      );

      const daysLeft = Math.floor(
        (expiry - today) / (1000 * 60 * 60 * 24)
      );

      if (daysLeft < 0) {
        calculatedStatus = "Expired";
      } else if (daysLeft <= 30) {
        calculatedStatus = "Expiring Soon";
      }
    }
  }

  return {
    ...doc,
    name: doc.title,
    status: calculatedStatus,
    uploadDate: doc.created_at
      ? new Date(doc.created_at).toLocaleDateString()
      : "—",
    expiryDate: doc.expiry_date
      ? new Date(doc.expiry_date).toLocaleDateString()
      : null
  };
});

      setDocuments(formattedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  fetchDocuments();
}, []);

  const categories = [
    "All",
    "Certificates",
    "Insurance",
    "Invoices",
    "Warranties",
    "Identity Proof",
    "Other"
  ];

  // Search and category filtering
  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const matchesSearch =
        document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        document.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [documents, searchTerm, selectedCategory]);

  // Delete document from the current frontend list
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to permanently delete this document?"
  );

  if (!confirmDelete) return;

  try {
    await deleteDocument(id);

    setDocuments((previousDocuments) =>
      previousDocuments.filter((document) => document.id !== id)
    );

    setSelectedDocument(null);

    alert("Document deleted successfully!");
  } catch (error) {
    console.error("Delete error:", error);
    alert(
      error.response?.data?.detail ||
      "Failed to delete document. Please try again."
    );
  }
};

  // Download a document using its available file URL
  const handleDownload = async (document) => {
  try {
    const blob = await downloadDocument(document.id);

    const url = window.URL.createObjectURL(blob);

    const link = window.document.createElement("a");
    link.href = url;
    link.download = document.original_filename || document.name;

    window.document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Download error:", error);
    alert("Failed to download document.");
  }
};

const handleView = async (document) => {
  const newWindow = window.open("", "_blank");

  if (!newWindow) {
    alert("Please allow pop-ups to view the document.");
    return;
  }

  try {
    const blob = await viewDocument(document.id);

    const url = window.URL.createObjectURL(blob);
    newWindow.location.href = url;

  } catch (error) {
    console.error("View error:", error);
    newWindow.close();
    alert("Failed to open document.");
  }
};



  return (
    <div className="documents-page">

    

      {/* Main content */}
      <main className="documents-main">

        {/* Header */}
        <header className="documents-header">

          <div>
            <p className="documents-eyebrow">
              YOUR PERSONAL DOCUMENT VAULT
            </p>

            <h1>My Documents</h1>

            <p className="documents-description">
              Organize, search and manage all your important documents.
            </p>
          </div>

          <Link to="/upload" className="documents-upload-button">
            <UploadCloud />
            Upload Document
          </Link>

        </header>

        {/* Document statistics */}
        <section className="documents-summary">

          <div className="documents-summary-card">
            <span>Total Documents</span>
            <strong>{documents.length}</strong>
          </div>

          <div className="documents-summary-card">
            <span>Active</span>
            <strong>
              {documents.filter((doc) => doc.status === "Active").length}
            </strong>
          </div>

          <div className="documents-summary-card">
            <span>Expiring Soon</span>
            <strong>
              {documents.filter((doc) => doc.status === "Expiring Soon").length}
            </strong>
          </div>

          <div className="documents-summary-card">
            <span>Expired</span>
            <strong>
              {documents.filter((doc) => doc.status === "Expired").length}
            </strong>
          </div>

        </section>

        {/* Search and filter */}
        <section className="documents-toolbar">

          <div className="documents-search">
            <Search />

            <input
              type="text"
              placeholder="Search by document name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="documents-filter">
            <Filter />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

        </section>

        {/* Document list */}
        <section className="documents-content">

          <div className="documents-content-heading">
            <div>
              <h2>All Documents</h2>
              <p>
                {filteredDocuments.length} document(s) found
              </p>
            </div>
          </div>

          {filteredDocuments.length === 0 ? (

            <div className="documents-empty">

              <div className="documents-empty-icon">
                <FolderOpen />
              </div>

              <h2>
                {documents.length === 0
                  ? "Your document vault is empty"
                  : "No matching documents found"}
              </h2>

              <p>
                {documents.length === 0
                  ? "Upload your first document to start organizing your important files securely."
                  : "Try another search term or choose a different category."}
              </p>

              {documents.length === 0 ? (
                <Link to="/upload" className="documents-empty-button">
                  <UploadCloud />
                  Upload Your First Document
                </Link>
              ) : (
                <button
                  className="documents-clear-button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </button>
              )}

            </div>

          ) : (

            <div className="documents-table-wrapper">

              <table className="documents-table">

                <thead>
                  <tr>
                    <th>DOCUMENT NAME</th>
                    <th>CATEGORY</th>
                    <th>UPLOAD DATE</th>
                    <th>EXPIRY DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDocuments.map((doc) => (

                    <tr key={doc.id}>

                      <td>
                        <div className="documents-name-cell">
                          <FileText />
                          <span>{doc.name}</span>
                        </div>
                      </td>

                      <td>{doc.category}</td>

                      <td>{doc.uploadDate || "—"}</td>

                      <td>{doc.expiryDate || "No expiry"}</td>

                      <td>
                        <span
                          className={`documents-status ${
                            doc.status.toLowerCase().replace(" ", "-")
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>

                      <td>
                        <div className="documents-actions">

                          <button
                            title="View document"
                            onClick={() => handleView(doc)}
                          >
                            <Eye />
                          </button>

                          <button
                            title="Download document"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download />
                          </button>

                          <button
                            title="Delete document"
                            className="delete-action"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 />
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* Document details popup */}
        {selectedDocument && (

          <div
            className="document-modal-overlay"
            onClick={() => setSelectedDocument(null)}
          >

            <div
              className="document-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="document-modal-header">
                <h2>Document Details</h2>

                <button
                  onClick={() => setSelectedDocument(null)}
                  aria-label="Close details"
                >
                  <X />
                </button>
              </div>

              <div className="document-modal-body">

                <div className="modal-file-icon">
                  <FileText />
                </div>

                <h3>{selectedDocument.name}</h3>

                <p>
                  Category: {selectedDocument.category}
                </p>

                <p>
                  Upload date: {selectedDocument.uploadDate || "Not available"}
                </p>

                <p>
                  Expiry date: {selectedDocument.expiryDate || "No expiry date"}
                </p>

                <p>
                  Status: {selectedDocument.status}
                </p>

                <button
                  className="modal-download-button"
                  onClick={() => handleDownload(selectedDocument)}
                >
                  <Download />
                  Download Document
                </button>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default Documents;