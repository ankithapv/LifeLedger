import React, { useState } from "react";

import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  AlertTriangle,
  FileText,
  Mail,
  MessageSquare,
  Globe
} from "lucide-react";

import { useNotifications } from "../context/NotificationContext";

import "../styles/Notifications.css";

function Notifications() {
  const [activeFilter, setActiveFilter] = useState("All");

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "Unread") return !notification.isRead;
    if (activeFilter === "Read") return notification.isRead;

    if (activeFilter === "Reminders") {
      return (
        notification.notificationType?.includes("days") ||
        notification.notificationType === "expired"
      );
    }

    return true;
  });

  // Toggle between Read and Unread
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Unable to update notification:", error);
    }
  };

  // Mark all unread notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Unable to mark all notifications as read:", error);
    }
  };

  const getIcon = (icon) => {
    if (icon === "clock") return <Clock />;
    if (icon === "file") return <FileText />;
    return <AlertTriangle />;
  };

  return (
    <div className="notification-page">
      <main className="notification-main">

        <div className="notification-heading">
          <div>
            <p>STAY INFORMED</p>
            <h1>Notifications</h1>
            <span>
              Important updates and reminders for your documents.
            </span>
          </div>

          <div className="notification-unread-card">
            <Bell />
            <div>
              <strong>{unreadCount}</strong>
              <span>Unread notifications</span>
            </div>
          </div>
        </div>

        <section className="notification-channels">
          <h2>Notification Channels</h2>

          <div className="notification-channel-grid">

            <div className="notification-channel">
              <span className="channel-icon email">
                <Mail />
              </span>
              <div>
                <strong>Email</strong>
                <p>Expiry and account updates</p>
              </div>
              <span className="channel-status">Active</span>
            </div>

            <div className="notification-channel">
              <span className="channel-icon sms">
                <MessageSquare />
              </span>
              <div>
                <strong>SMS</strong>
                <p>Important expiry reminders</p>
              </div>
              <span className="channel-status">Planned</span>
            </div>

            <div className="notification-channel">
              <span className="channel-icon browser">
                <Globe />
              </span>
              <div>
                <strong>Browser Push</strong>
                <p>Website and browser alerts</p>
              </div>
              <span className="channel-status">Planned</span>
            </div>

          </div>
        </section>

        <section className="notification-content">

          <div className="notification-content-heading">
            <div>
              <h2>All Notifications</h2>
              <p>Manage your recent updates.</p>
            </div>

            <div className="notification-actions">
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck /> Mark all read
              </button>
            </div>
          </div>

          <div className="notification-filters">
            {["All", "Unread", "Read", "Reminders"].map((filter) => (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="notification-list">

            {loading ? (

              <div className="notification-empty">
                <Bell size={40} />
                <h3>Loading notifications...</h3>
              </div>

            ) : error ? (

              <div className="notification-empty">
                <AlertTriangle size={40} />
                <h3>Unable to load notifications</h3>
                <p>{error}</p>
              </div>

            ) : filteredNotifications.length === 0 ? (

              <div className="notification-empty">
                <Bell size={40} />
                <h3>
                  {notifications.length === 0
                    ? "You're all caught up!"
                    : "No notifications found"}
                </h3>
                <p>
                  {notifications.length === 0
                    ? "When you receive document expiry updates, your notifications will appear here."
                    : "There are no notifications in this category."}
                </p>
              </div>

            ) : (

              filteredNotifications.map((notification) => (
                <div
                  className={`notification-item ${
                    !notification.isRead ? "unread" : ""
                  }`}
                  key={notification.id}
                >

                  <div className="notification-item-icon">
                    {getIcon(notification.icon)}
                  </div>

                  <div className="notification-item-content">

                    <div className="notification-item-title">
                      <h3>{notification.title}</h3>

                      {!notification.isRead && (
                        <span className="unread-dot" />
                      )}
                    </div>

                    <p>{notification.message}</p>

                    <div className="notification-item-meta">
                      <span>
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleString()
                          : ""}
                      </span>
                      <span>{notification.notificationType}</span>
                    </div>

                  </div>

                  <div className="notification-item-actions">

                    {/* Button remains visible for both states */}
                    <button
                      type="button"
                      title={
                        notification.isRead
                          ? "Mark as unread"
                          : "Mark as read"
                      }
                      aria-label={
                        notification.isRead
                          ? "Mark as unread"
                          : "Mark as read"
                      }
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      {notification.isRead ? (
                        <CheckCheck />
                      ) : (
                        <Check />
                      )}
                    </button>

                  </div>

                </div>
              ))

            )}

          </div>
        </section>

      </main>
    </div>
  );
}

export default Notifications;