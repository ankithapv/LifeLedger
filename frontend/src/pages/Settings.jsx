import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  ArrowLeft,
  CalendarDays,
  Settings as SettingsIcon,
  Palette
} from "lucide-react";

import "../styles/Settings.css";

function Settings() {
  const [profile, setProfile] = useState({
    name: "",
    email: ""
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    browser: true,
    inApp: true
  });

  const [reminders, setReminders] = useState([
    "30", "15", "7", "3", "1", "0"
  ]);

  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value
    }));

    setMessage("");
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;

    setNotifications((previous) => ({
      ...previous,
      [name]: checked
    }));

    setMessage("");
  };

  const handleReminderChange = (value) => {
    setReminders((previous) =>
      previous.includes(value)
        ? previous.filter((day) => day !== value)
        : [...previous, value]
    );

    setMessage("");
  };

  const handleSave = (e) => {
    e.preventDefault();

    const settings = {
      profile,
      notifications,
      reminders,
      theme
    };

    console.log("Settings ready for backend:", settings);

    setMessage(
      "Settings updated in this demo. Permanent saving will be enabled after backend integration."
    );
  };

  return (
    <div className="settings-layout">
      <main className="settings-main">

        <header className="settings-header">
          <div>
            <Link to="/dashboard" className="settings-back">
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h1>Settings</h1>
            <p>
              Customize your LifeLedger experience and preferences.
            </p>
          </div>
        </header>

        <form onSubmit={handleSave}>

          <section className="settings-card">
            <div className="settings-section-title">
              <User size={22} />
              <div>
                <h2>Profile Information</h2>
                <p>Manage your basic account details.</p>
              </div>
            </div>

            <div className="settings-form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={profile.name}
                onChange={handleProfileChange}
              />
            </div>

            <div className="settings-form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={profile.email}
                onChange={handleProfileChange}
              />
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-section-title">
              <Bell size={22} />
              <div>
                <h2>Notification Preferences</h2>
                <p>Choose how LifeLedger contacts you.</p>
              </div>
            </div>

            {[
              {
                name: "email",
                title: "Email Notifications",
                description: "Receive expiry alerts through email.",
                icon: <Mail size={20} />
              },
              {
                name: "sms",
                title: "SMS Notifications",
                description: "Receive important reminders through SMS.",
                icon: <MessageSquare size={20} />
              },
              {
                name: "browser",
                title: "Browser Push Notifications",
                description: "Receive alerts through browser notifications.",
                icon: <Smartphone size={20} />
              },
              {
                name: "inApp",
                title: "In-App Notifications",
                description: "View alerts inside your LifeLedger dashboard.",
                icon: <Bell size={20} />
              }
            ].map((item) => (
              <div className="settings-option" key={item.name}>
                <div className="settings-option-info">
                  {item.icon}
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  name={item.name}
                  checked={notifications[item.name]}
                  onChange={handleNotificationChange}
                />
              </div>
            ))}
          </section>

          <section className="settings-card">
            <div className="settings-section-title">
              <CalendarDays size={22} />
              <div>
                <h2>Reminder Schedule</h2>
                <p>
                  Select how early you want to know about document expiry.
                </p>
              </div>
            </div>

            <div className="reminder-options">
              {[
                { value: "30", label: "30 days before" },
                { value: "15", label: "15 days before" },
                { value: "7", label: "7 days before" },
                { value: "3", label: "3 days before" },
                { value: "1", label: "1 day before" },
                { value: "0", label: "On expiry date" }
              ].map((item) => (
                <label
                  className="reminder-checkbox"
                  key={item.value}
                >
                  <input
                    type="checkbox"
                    checked={reminders.includes(item.value)}
                    onChange={() => handleReminderChange(item.value)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-section-title">
              <Palette size={22} />
              <div>
                <h2>Appearance</h2>
                <p>Choose your preferred application theme.</p>
              </div>
            </div>

            <div className="settings-form-group">
              <label>Application Theme</label>

              <select
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value);
                  setMessage("");
                }}
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
              </select>
            </div>
          </section>

          <div className="settings-save-area">
            <button type="submit" className="settings-save-btn">
              <Save size={18} />
              Save Settings
            </button>

            {message && (
              <p className="settings-success">{message}</p>
            )}
          </div>

        </form>
      </main>
    </div>
  );
}

export default Settings;