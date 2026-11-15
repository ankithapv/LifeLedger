import React, { useEffect, useState } from "react";

import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  CalendarDays,
  ShieldCheck,
  ArrowUpRight,
  Bell,
  UploadCloud,
  Sparkles,
  Search
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import { Link } from "react-router-dom";
import { getDocuments } from "../services/documentService";
import "../styles/Dashboard.css";

// Calculate days remaining until expiry.
function getDaysUntilExpiry(expiryDate) {
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

function getDocumentStatus(expiryDate) {
  const days = getDaysUntilExpiry(expiryDate);

  if (days === null) return "Active";
  if (days < 0) return "Expired";
  if (days <= 7) return "Expiring Soon";

  return "Active";
}

function formatDate(dateValue) {
  if (!dateValue) return "No expiry date";

  const datePart = String(dateValue).slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

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

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardDocuments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDocuments();

        console.log("Dashboard documents:", data);

        setDocuments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Dashboard document fetch error:", err);
        setError("Unable to load documents. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardDocuments();
  }, []);

  const documentsWithStatus = documents.map((doc) => ({
    ...doc,
    dashboardStatus: getDocumentStatus(doc.expiry_date)
  }));

  const totalDocuments = documents.length;

  const activeDocuments = documentsWithStatus.filter(
    (doc) => doc.dashboardStatus === "Active"
  ).length;

  const expiringDocuments = documentsWithStatus.filter(
    (doc) => doc.dashboardStatus === "Expiring Soon"
  ).length;

  const expiredDocuments = documentsWithStatus.filter(
    (doc) => doc.dashboardStatus === "Expired"
  ).length;

  const stats = [
    {
      title: "Total Documents",
      value: totalDocuments,
      icon: <FileText />,
      color: "blue"
    },
    {
      title: "Active Documents",
      value: activeDocuments,
      icon: <CheckCircle2 />,
      color: "green"
    },
    {
      title: "Expiring Soon",
      value: expiringDocuments,
      icon: <Clock3 />,
      color: "orange"
    },
    {
      title: "Expired Documents",
      value: expiredDocuments,
      icon: <AlertTriangle />,
      color: "red"
    }
  ];

  // Category chart data.
  const categoryCounts = {};

  documents.forEach((doc) => {
    const category = doc.category || "Other";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCounts).map(
    ([name, value]) => ({ name, value })
  );

  // Recently uploaded documents.
  const recentDocuments = [...documentsWithStatus]
    .sort(
      (a, b) =>
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
    )
    .slice(0, 5)
    .map((doc) => ({
      id: doc.id,
      name: doc.title || doc.original_filename || "Untitled document",
      category: doc.category || "Other",
      date: formatDate(doc.created_at),
      status: doc.dashboardStatus
    }));

  // Documents expiring within seven days.
  const upcomingReminders = documentsWithStatus
    .filter((doc) => doc.dashboardStatus === "Expiring Soon")
    .sort(
      (a, b) =>
        getDaysUntilExpiry(a.expiry_date) -
        getDaysUntilExpiry(b.expiry_date)
    )
    .slice(0, 5)
    .map((doc) => {
      const days = getDaysUntilExpiry(doc.expiry_date);

      return {
        id: doc.id,
        name: doc.title || doc.original_filename || "Untitled document",
        date: formatDate(doc.expiry_date),
        remaining:
          days === 0
            ? "Expires today"
            : days === 1
              ? "1 day left"
              : `${days} days left`
      };
    });

  const chartColors = [
    "#7659e8",
    "#14b8a6",
    "#f59e0b",
    "#ec4899",
    "#0ea5e9"
  ];

  const healthScore =
    totalDocuments === 0
      ? 0
      : Math.round((activeDocuments / totalDocuments) * 100);

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">

        {/* Dashboard Header */}
        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-date">
              YOUR PERSONAL DOCUMENT VAULT
            </p>

            <h1>Dashboard</h1>

            <p className="dashboard-subtitle">
              Everything important, organised and protected in one place.
            </p>
          </div>

          <div className="topbar-actions">
            <Link to="/notifications" className="topbar-icon">
              <Bell />
            </Link>

            <div className="profile-avatar">U</div>
          </div>
        </header>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* Welcome Banner */}
        <section className="dashboard-welcome">
          <div className="welcome-content">
            <span className="welcome-label">
              <Sparkles size={14} />
              YOUR DOCUMENT SPACE
            </span>

            <h2>
              Welcome back!
              <br />
              Your documents, all in one place.
            </h2>

            <p>
              Stay organised, track expiry dates and keep your
              important documents safe.
            </p>

            <Link to="/upload" className="welcome-button">
              <UploadCloud size={17} />
              Upload New Document
            </Link>
          </div>

          <div className="welcome-illustration">
            <div className="welcome-circle">
              <FileText />
              <ShieldCheck className="welcome-shield" />
            </div>
          </div>
        </section>

        {/* Statistics Cards */}
        <section className="stats-grid">
          {stats.map((item) => (
            <div className="stat-card" key={item.title}>
              <div className={`stat-icon ${item.color}`}>
                {item.icon}
              </div>

              <div>
                <p>{item.title}</p>
                <h2>{loading ? "—" : item.value}</h2>
              </div>

              <ArrowUpRight className="stat-arrow" />
            </div>
          ))}
        </section>

        {/* Category and Document Health */}
        <section className="dashboard-grid">

          {/* Document Categories */}
          <div className="dashboard-card category-card">
            <div className="card-heading">
              <div>
                <h2>Document Categories</h2>
                <p>Distribution of your uploaded documents</p>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <p>Loading categories...</p>
              </div>
            ) : categoryData.length === 0 ? (
              <div className="empty-state">
                <FileText />
                <h3>No categories yet</h3>
                <p>
                  Upload your first document to see category
                  statistics here.
                </p>
                <Link to="/upload" className="empty-action">
                  Upload Document
                </Link>
              </div>
            ) : (
              <div className="category-chart">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="category-legend">
                  {categoryData.map((item, index) => (
                    <div className="category-legend-item" key={item.name}>
                      <span
                        className="legend-dot"
                        style={{
                          backgroundColor:
                            chartColors[index % chartColors.length]
                        }}
                      />

                      <span>{item.name}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Document Health */}
          <div className="dashboard-card health-card">
            <div className="card-heading">
              <div>
                <h2>Document Health</h2>
                <p>Overall document status</p>
              </div>

              <ShieldCheck className="health-heading-icon" />
            </div>

            <div className="health-score">
              <div
                className="health-circle"
                style={{
                  "--health-progress": `${healthScore * 3.6}deg`
                }}
              >
                <strong>{loading ? "—" : healthScore}</strong>
                <span>/ 100</span>
              </div>
            </div>

            <h3>
              {loading
                ? "Calculating..."
                : totalDocuments === 0
                  ? "No documents yet"
                  : healthScore >= 80
                    ? "Your documents look healthy!"
                    : healthScore >= 50
                      ? "Some documents need attention"
                      : "Your documents need attention"}
            </h3>

            <p className="health-description">
              {loading
                ? "Calculating your document health."
                : totalDocuments === 0
                  ? "Upload documents to calculate your document health score."
                  : `${activeDocuments} active, ${expiringDocuments} expiring soon and ${expiredDocuments} expired.`}
            </p>
          </div>
        </section>

        {/* Recent Documents and Reminders */}
        <section className="dashboard-grid bottom-grid">

          {/* Recent Documents */}
          <div className="dashboard-card recent-card">
            <div className="card-heading">
              <div>
                <h2>Recent Documents</h2>
                <p>Your recently uploaded documents</p>
              </div>

              <Link to="/documents" className="view-all">
                View all
              </Link>
            </div>

            {loading ? (
              <div className="empty-state small-empty">
                <p>Loading documents...</p>
              </div>
            ) : recentDocuments.length === 0 ? (
              <div className="empty-state small-empty">
                <FileText />
                <h3>No documents uploaded</h3>
                <p>Your recent documents will appear here.</p>
                <Link to="/upload" className="empty-action">
                  Upload your first document
                </Link>
              </div>
            ) : (
              <div className="document-table">
                {recentDocuments.map((doc) => (
                  <div className="document-row" key={doc.id}>
                    <strong>{doc.name}</strong>
                    <span>{doc.category}</span>
                    <span>{doc.date}</span>

                    <span
                      className={`document-status ${doc.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Expiry */}
          <div className="dashboard-card reminders-card">
            <div className="card-heading">
              <div>
                <h2>Upcoming Expiry</h2>
                <p>Documents needing attention</p>
              </div>

              <CalendarDays className="reminder-heading-icon" />
            </div>

            {loading ? (
              <div className="empty-state small-empty">
                <p>Loading reminders...</p>
              </div>
            ) : upcomingReminders.length === 0 ? (
              <div className="empty-state small-empty">
                <CalendarDays />
                <h3>No upcoming reminders</h3>
                <p>
                  Documents expiring within seven days will appear here.
                </p>
              </div>
            ) : (
              <div className="reminder-list">
                {upcomingReminders.map((reminder) => (
                  <div className="reminder-item" key={reminder.id}>
                    <div className="reminder-date-icon">
                      <CalendarDays />
                    </div>

                    <div className="reminder-details">
                      <strong>{reminder.name}</strong>
                      <p>{reminder.date}</p>
                    </div>

                    <span>{reminder.remaining}</span>
                  </div>
                ))}
              </div>
            )}

            <Link to="/calendar" className="calendar-link">
              Open expiry calendar
              <ArrowUpRight />
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-quick-action">
          <div>
            <h2>What would you like to do?</h2>
            <p>Quick access to your document management tools.</p>
          </div>

          <div className="quick-action-links">
            <Link to="/upload" className="empty-action">
              <UploadCloud size={18} />
              Upload Document
            </Link>

            <Link to="/documents" className="quick-search-link">
              <Search size={17} />
              Manage Documents
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;