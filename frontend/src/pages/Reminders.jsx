import React, { useEffect, useState } from "react";

import {
  Clock,
  CheckCircle,
  AlertTriangle,
  CalendarDays,
  UploadCloud,
  BellRing
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getReminders,
  completeReminder,
  pendingReminder
} from "../services/reminderService";

import { updateDocument } from "../services/documentService";

import "../styles/Reminders.css";


function getDaysLeft(expiryDate) {
  if (!expiryDate) return null;

  const datePart = String(expiryDate).slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) return null;

  const expiry = Date.UTC(year, month - 1, day);

  const now = new Date();

  const today = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return Math.round((expiry - today) / 86400000);
}


function formatExpiryDate(date) {
  if (!date) return "No expiry date";

  const [year, month, day] = String(date)
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (!year || !month || !day) return "Date unavailable";

  return new Date(year, month - 1, day).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
}


function Reminders() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const [renewalId, setRenewalId] = useState(null);
  const [renewalDate, setRenewalDate] = useState("");


  // Fetch reminders
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getReminders();

        const generatedReminders = (
          Array.isArray(data) ? data : []
        )
          .map((item) => ({
            id: item.id,
            documentId: item.document_id,
            title: item.title || "Untitled document",
            category: item.category || "Other",
            expiryDate: formatExpiryDate(item.expiry_date),
            daysLeft: getDaysLeft(item.expiry_date),
            completed: item.completed
          }))
          .sort((a, b) => a.daysLeft - b.daysLeft);

        setReminders(generatedReminders);

      } catch (err) {
        console.error("Reminder fetch error:", err);

        setError(
          "Unable to load reminders. Please check your connection."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);


  // Mark reminder completed or pending
  const markCompleted = async (id, isCompleted) => {

    if (isCompleted) {
      try {
        setBusyId(id);
        setError("");

        await pendingReminder(id);

        setReminders((previous) =>
          previous.map((item) =>
            item.id === id
              ? { ...item, completed: false }
              : item
          )
        );

      } catch (err) {
        console.error("Reminder update error:", err);

        setError(
          "Unable to update reminder. Please try again."
        );

      } finally {
        setBusyId(null);
      }

    } else {
      setRenewalId(id);
      setRenewalDate("");
    }
  };


  // Save new expiry date and complete reminder
  const saveRenewalDate = async () => {

    if (!renewalDate || !renewalId) {
      setError("Please select a new expiry date.");
      return;
    }

    // Validate date
    const [year, month, day] = renewalDate.split("-").map(Number);

    const dateCheck = new Date(year, month - 1, day);

    if (
      dateCheck.getFullYear() !== year ||
      dateCheck.getMonth() !== month - 1 ||
      dateCheck.getDate() !== day
    ) {
      setError("Please select a valid expiry date.");
      return;
    }

    try {
      setBusyId(renewalId);
      setError("");

      const reminder = reminders.find(
        (item) => item.id === renewalId
      );

      if (!reminder) {
        throw new Error("Reminder not found");
      }

      // First update document expiry date
      await updateDocument(reminder.documentId, {
        expiry_date: `${renewalDate}T00:00:00`
      });

      // Then mark reminder completed
      await completeReminder(renewalId);

      // Calculate new days remaining
      const expiry = Date.UTC(year, month - 1, day);

      const now = new Date();

      const today = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const daysLeft = Math.round(
        (expiry - today) / 86400000
      );

      // Update frontend
      setReminders((previous) =>
        previous.map((item) =>
          item.id === renewalId
            ? {
                ...item,
                completed: true,
                expiryDate: formatExpiryDate(renewalDate),
                daysLeft
              }
            : item
        )
      );

      setRenewalId(null);
      setRenewalDate("");

    } catch (err) {
      console.error("Renewal error:", err);

      setError(
        "Unable to renew document. Please try again."
      );

    } finally {
      setBusyId(null);
    }
  };


  // Filter reminders
  const filteredReminders = reminders.filter((item) => {

    if (filter === "Pending") return !item.completed;

    if (filter === "Completed") return item.completed;

    if (filter === "Urgent") {
      return item.daysLeft <= 7 && !item.completed;
    }

    return true;
  });


  // Summary counts
  const pendingCount = reminders.filter(
    (item) => !item.completed
  ).length;

  const completedCount = reminders.filter(
    (item) => item.completed
  ).length;

  const urgentCount = reminders.filter(
    (item) => item.daysLeft <= 7 && !item.completed
  ).length;


  return (
    <div className="reminders-layout">

      <main className="reminders-main">

        <div className="reminders-header">
          <div>
            <h1>Document Reminders</h1>

            <p className="reminders-subtitle">
              Never miss an important document renewal or expiry date.
            </p>
          </div>
        </div>


        {error && (
          <div className="reminders-error">
            {error}
          </div>
        )}


        {/* Summary cards */}
        <div className="reminders-summary">

          <div className="reminder-summary-card">
            <Clock color="#3156a3" size={25} />

            <h2>{loading ? "—" : pendingCount}</h2>

            <p>Pending Reminders</p>
          </div>


          <div className="reminder-summary-card">
            <AlertTriangle color="#ea580c" size={25} />

            <h2>{loading ? "—" : urgentCount}</h2>

            <p>Urgent Reminders</p>
          </div>


          <div className="reminder-summary-card">
            <CheckCircle color="#16a34a" size={25} />

            <h2>{loading ? "—" : completedCount}</h2>

            <p>Completed Reminders</p>
          </div>

        </div>


        {/* Filters */}
        <div className="reminders-filters">

          {["All", "Pending", "Urgent", "Completed"].map((item) => (

            <button
              key={item}
              type="button"
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>

          ))}

        </div>


        {/* Reminder list */}
        <section className="reminders-list">

          <h2>Your Reminders</h2>


          {loading ? (

            <p>Loading your document reminders...</p>

          ) : filteredReminders.length === 0 ? (

            <div className="reminders-empty-state">

              <div className="reminders-empty-icon">
                <CalendarDays size={42} />
              </div>

              <h3>
                {error
                  ? "Reminders could not be loaded"
                  : reminders.length === 0
                    ? "No reminders yet"
                    : "No reminders found"}
              </h3>

              <p>
                {reminders.length === 0
                  ? "Upload documents with expiry dates to see reminders here."
                  : "There are no reminders in this category right now."}
              </p>

              {reminders.length === 0 && !error && (

                <button
                  type="button"
                  className="reminders-upload-btn"
                  onClick={() => navigate("/upload")}
                >
                  <UploadCloud size={18} />
                  Upload a Document
                </button>

              )}

            </div>

          ) : (

            filteredReminders.map((item) => (

              <div className="reminder-item" key={item.id}>

                <div>

                  <h3>{item.title}</h3>

                  <p>
                    {item.category} · Expiry: {item.expiryDate}
                  </p>

                  <p className={
                    item.completed
                      ? "completed"
                      : item.daysLeft <= 7
                        ? "urgent"
                        : ""
                  }>
                    {item.completed
                      ? "Reminder completed"
                      : item.daysLeft < 0
                        ? `Expired ${Math.abs(item.daysLeft)} days ago`
                        : item.daysLeft === 0
                          ? "Expires today"
                          : `${item.daysLeft} days remaining`}
                  </p>

                </div>


                {/* Complete / Pending button */}
                <button
                  type="button"
                  className={`reminder-complete-btn ${
                    item.completed ? "done" : ""
                  }`}
                  disabled={busyId === item.id}
                  onClick={() =>
                    markCompleted(item.id, item.completed)
                  }
                >
                  {busyId === item.id
                    ? "Updating..."
                    : item.completed
                      ? "Mark Pending"
                      : "Mark Completed"}
                </button>


                {/* Renewal date selection */}
                {renewalId === item.id && (

                  <div className="renewal-date-box">

                    <label>
                      Enter New Expiry Date
                    </label>

                    <input
                      type="date"
                      value={renewalDate}
                      onChange={(e) =>
                        setRenewalDate(e.target.value)
                      }
                    />


                    <button
                      type="button"
                      onClick={saveRenewalDate}
                      disabled={
                        busyId === item.id || !renewalDate
                      }
                    >
                      {busyId === item.id
                        ? "Saving..."
                        : "Save Renewal"}
                    </button>


                    <button
                      type="button"
                      onClick={() => {
                        setRenewalId(null);
                        setRenewalDate("");
                        setError("");
                      }}
                      disabled={busyId === item.id}
                    >
                      Cancel
                    </button>

                  </div>

                )}

              </div>

            ))

          )}

        </section>


        {/* Information */}
        <div className="reminders-info">

          <BellRing size={21} />

          <div>

            <strong>Smart Expiry Tracking</strong>

            <p>
              LifeLedger tracks expiry dates saved with your documents.
              Automatic notifications will be integrated separately.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Reminders;