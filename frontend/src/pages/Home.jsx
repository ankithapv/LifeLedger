import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">

      <nav className="home-navbar">
        <h2>LifeLedger</h2>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-button">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-tag">
            YOUR DOCUMENTS. ONE SMART PLACE.
          </p>

          <h1>
            Manage Your Documents
            <span> Smarter and Safer.</span>
          </h1>

          <p className="hero-description">
            Store, organize, search and track all your
            important documents in one secure place.
            Never miss an expiry date or renewal again.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-button">
              Get Started
            </Link>

            <Link to="/login" className="secondary-button">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Everything You Need in One Place</h2>

        <div className="feature-list">
          <div className="feature-card">
            <h3>Secure Vault</h3>
            <p>Keep your important documents organized and protected.</p>
          </div>

          <div className="feature-card">
            <h3>Smart Search</h3>
            <p>Find documents using names, categories and extracted text.</p>
          </div>

          <div className="feature-card">
            <h3>Expiry Reminders</h3>
            <p>Stay informed about upcoming renewals and expiry dates.</p>
          </div>

          <div className="feature-card">
            <h3>AI Assistant</h3>
            <p>Find information about your documents with natural language.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        © 2026 LifeLedger. All rights reserved.
      </footer>

    </div>
  );
}

export default Home;