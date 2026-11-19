import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

import "../styles/Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset-page">
      <div className="password-reset-card">

        <h2>Forgot Password?</h2>

        <p>
          Don't worry! Enter your registered email address.
          We'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="password-reset-message">{message}</p>
        )}

        {error && (
          <p className="password-reset-error">{error}</p>
        )}

        <Link to="/login">Back to Login</Link>

      </div>
    </div>
  );
}

export default ForgotPassword;