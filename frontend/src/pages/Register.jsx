import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (formData.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      setMessageType("error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        full_name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      setMessage("Account created successfully! Redirecting to login...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      const statusCode = error.response?.status;

      if (statusCode === 409) {
        setMessage("This email is already registered. Please log in.");
      } else if (statusCode === 422) {
        setMessage("Please enter valid details. Check your name, email and password.");
      } else {
        setMessage(
          error.response?.data?.detail ||
          "Registration failed. Please check your connection and try again."
        );
      }

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h1 className="register-logo">
          LifeLedger
        </h1>

        <h2>Create Account</h2>

        <p className="register-description">
          Create your personal document vault.
        </p>

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {message && (
            <p className={`register-message ${messageType}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="register-login-link">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

        <p className="register-home-link">
          <Link to="/">Back to Home</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;