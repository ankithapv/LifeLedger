import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/authService";

import {
  User,
  Save,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  LogOut
} from "lucide-react";

import "../styles/Profile.css";

function Profile() {
  const { user, logout,setUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  });

  const [message, setMessage] = useState("");

  // Load logged-in user's information
  useEffect(() => {
  if (user) {
    setProfile({
      name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || ""
    });
  }
}, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value
    }));

    setMessage("");
  };

  // Handle profile form submission
  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");

  try {
    const updatedUser = await updateUserProfile({
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio
    });

    setUser(updatedUser);

    setProfile((previous) => ({
      ...previous,
      name: updatedUser.full_name || "",
      email: updatedUser.email || "",
      phone: updatedUser.phone || "",
      location: updatedUser.location || "",
      bio: updatedUser.bio || ""
    }));

    setMessage("Profile updated successfully!");
  } catch (error) {
    console.error("Profile update error:", error);

    setMessage(
      error.response?.data?.detail ||
      "Unable to update profile. Please try again."
    );
  }
};

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="profile-layout">
      <main className="profile-main">

        {/* Back to Dashboard */}
        <Link to="/dashboard" className="profile-back">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Profile Heading */}
        <div className="profile-heading">
          <div>
            <h1>My Profile</h1>
            <p className="profile-subtitle">
              Manage your personal account information.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <form className="profile-card" onSubmit={handleSubmit}>

          {/* Profile Header */}
          <div className="profile-card-header">
            <div className="profile-avatar">
              <User size={32} />
            </div>

            <div>
              <h3>Personal Information</h3>
              <p>Keep your account details up to date.</p>
            </div>
          </div>

          {/* Full Name */}
          <div className="profile-form-group">
            <label>
              <User size={15} /> Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={profile.name}
              readOnly
            />
          </div>

          {/* Email */}
          <div className="profile-form-group">
            <label>
              <Mail size={15} /> Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Your email address"
              value={profile.email}
              readOnly
            />
          </div>

          {/* Phone */}
          <div className="profile-form-group">
            <label>
              <Phone size={15} /> Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="profile-form-group">
            <label>
              <MapPin size={15} /> Location
            </label>

            <input
              type="text"
              name="location"
              placeholder="Enter your location"
              value={profile.location}
              onChange={handleChange}
            />
          </div>

          {/* About Me */}
          <div className="profile-form-group">
            <label>
              <FileText size={15} /> About Me
            </label>

            <textarea
              name="bio"
              placeholder="Write something about yourself"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="profile-save-btn"
          >
            <Save size={17} />
            Save Profile
          </button>

          {message && (
            <p className="profile-success">
              {message}
            </p>
          )}

        </form>

        {/* Logout Section */}
        <div style={{
          marginTop: "25px",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #f1caca",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap"
        }}>
          <div>
            <h3 style={{ margin: "0 0 5px" }}>
              Sign out of LifeLedger
            </h3>

            <p style={{
              margin: 0,
              fontSize: "13px",
              color: "#888"
            }}>
              Securely log out of your account.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#dc3545",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

      </main>
    </div>
  );
}

export default Profile;