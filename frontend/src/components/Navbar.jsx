import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  Sparkles
} from "lucide-react";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="ll-navbar">

      <div className="ll-navbar-heading">
        <div className="ll-greeting">
          <span className="ll-greeting-tag">
            <Sparkles size={13} /> YOUR PERSONAL VAULT
          </span>

          <h2>Welcome back!</h2>

          <p>
            Here's what's happening with your documents today.
          </p>
        </div>
      </div>

      <div className="ll-navbar-actions">

        <button
          className="ll-navbar-search"
          onClick={() => navigate("/search")}
        >
          <Search size={18} />
          <span>Search your documents...</span>
          <kbd>⌘ K</kbd>
        </button>

        <button
          className="ll-navbar-upload"
          onClick={() => navigate("/upload")}
        >
          <Plus size={18} />
          <span>Upload</span>
        </button>

        <button
          className="ll-navbar-notification"
          aria-label="Open notifications"
          onClick={() => navigate("/notifications")}
        >
          <Bell size={20} />
          <span className="ll-notification-indicator"></span>
        </button>

        <div
          className="ll-navbar-profile"
          onClick={() => navigate("/profile")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate("/profile");
          }}
        >
          <div className="ll-profile-avatar">U</div>

          <div className="ll-profile-info">
            <strong>My Account</strong>
            <span>Personal Vault</span>
          </div>

          <ChevronDown size={15} />
        </div>

      </div>
    </header>
  );
}

export default Navbar;