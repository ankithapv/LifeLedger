
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  getDocuments,
  viewDocument
} from "../services/documentService";

import {
  Search as SearchIcon,
  FileText,
  Filter,
  X,
  Sparkles
} from "lucide-react";

import "../styles/Search.css";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [documents, setDocuments] = useState([]);

  // Fetch uploaded documents from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getDocuments();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  // Automatically search while typing
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term && category === "All") {
      setResults([]);
      setSearched(false);
      return;
    }

    const filteredDocuments = documents.filter((doc) => {
      const title = (doc.title || "").toLowerCase();
      const filename = (doc.original_filename || "").toLowerCase();
      const docCategory = (doc.category || "").toLowerCase();

      const matchesSearch =
        title.includes(term) ||
        filename.includes(term) ||
        docCategory.includes(term);

      const matchesCategory =
        category === "All" || doc.category === category;

      return matchesSearch && matchesCategory;
    });

    setResults(filteredDocuments);
    setSearched(true);
  }, [searchTerm, category, documents]);

  // Search button
  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  // Open the actual uploaded document
  const handleViewDocument = async (documentId) => {
    const newTab = window.open("", "_blank");

    if (!newTab) {
      alert("Please allow pop-ups to view documents.");
      return;
    }

    try {
      const fileBlob = await viewDocument(documentId);
      const fileURL = URL.createObjectURL(fileBlob);

      newTab.location.href = fileURL;

      // Keep the URL alive while the document is open.
      // The browser will release it when the page is closed.
    } catch (error) {
      newTab.close();
      console.error("Error opening document:", error);
      alert(
        error.response?.data?.detail ||
        "Unable to open this document."
      );
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setCategory("All");
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="search-page">

      <main className="search-main">

        {/* Heading */}
        <div className="search-heading">
          <p>INTELLIGENT DOCUMENT DISCOVERY</p>
          <h1>Smart Search</h1>
          <span>
            Find important documents quickly using names,
            categories and extracted document information.
          </span>
        </div>

        {/* Search Box */}
        <section className="search-box">

          <div className="search-box-icon">
            <Sparkles />
          </div>

          <h2>What are you looking for?</h2>

          <p>
            Search using document name, category or keywords.
          </p>

          <form onSubmit={handleSearch}>

            <div className="search-input-wrapper">

              <SearchIcon />

              <input
                type="text"
                placeholder="Example: Insurance policy, marks card..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search text"
                >
                  <X />
                </button>
              )}

            </div>

            <div className="search-options">

              <div className="search-category">
                <Filter />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Certificates">Certificates</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Invoices">Invoices</option>
                  <option value="Warranties">Warranties</option>
                  <option value="Identity Proof">Identity Proof</option>
                  <option value="Other">Other</option>
                </select>

              </div>

              <button type="submit" className="search-submit">
                <SearchIcon />
                Search Documents
              </button>

            </div>

          </form>

        </section>

        {/* Search Results */}
        <section className="search-results">

          <div className="search-results-heading">

            <div>
              <h2>Search Results</h2>

              <p>
                {searched
                  ? `${results.length} document(s) found`
                  : "Your matching documents will appear here."}
              </p>
            </div>

            {searched && (
              <button
                onClick={clearSearch}
                className="search-clear"
              >
                Clear Search
              </button>
            )}

          </div>

          {!searched ? (

            <div className="search-empty">
              <SearchIcon />
              <h3>Start searching</h3>
              <p>
                Enter a document name or keyword to find your files.
              </p>
            </div>

          ) : results.length === 0 ? (

            <div className="search-empty">

              <FileText />

              <h3>No documents found</h3>

              <p>
                No matching documents were found.
                Try another name or category.
              </p>

              <Link to="/upload">
                Upload a Document
              </Link>

            </div>

          ) : (

            <div className="search-result-list">

              {results.map((document) => (

                <div
                  className="search-result-card"
                  key={document.id}
                  onClick={() =>
                    handleViewDocument(document.id)
                  }
                  style={{ cursor: "pointer" }}
                  title="Click to open document"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleViewDocument(document.id);
                    }
                  }}
                >

                  <FileText />

                  <div>
                    <h3>
                      {document.title || document.original_filename}
                    </h3>

                    <p>{document.category}</p>

                    <small>
                      Click to open document
                    </small>
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Search;