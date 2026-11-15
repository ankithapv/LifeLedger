import React, { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Clock,
  AlertTriangle,
  FileText,
  Mail,
  MessageSquare,
  Globe
} from "lucide-react";

import "../styles/Notifications.css";

function Notifications() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Real notifications will be fetched from the backend later.
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "Unread") return !notification.read;
    if (activeFilter === "Read") return notification.read;
    if (activeFilter === "Reminders") {
      return notification.type === "Reminder";
    }
    return true;
  });

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((notification) => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
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

        {/* Notification channels */}
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
              <span className="channel-status">Planned</span>
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

        {/* Notifications */}
        <section className="notification-content">

          <div className="notification-content-heading">
            <div>
              <h2>All Notifications</h2>
              <p>Manage your recent updates.</p>
            </div>

            <div className="notification-actions">
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck /> Mark all read
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="clear-notifications"
                disabled={notifications.length === 0}
              >
                <Trash2 /> Clear all
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

            {filteredNotifications.length === 0 ? (

              <div className="notification-empty">
                <Bell size={40} />
                <h3>
                  {notifications.length === 0
                    ? "You're all caught up!"
                    : "No notifications found"}
                </h3>
                <p>
                  {notifications.length === 0
                    ? "When you upload documents and receive expiry updates, your notifications will appear here."
                    : "There are no notifications in this category."}
                </p>
              </div>

            ) : (

              filteredNotifications.map((notification) => (
                <div
                  className={`notification-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  key={notification.id}
                >

                  <div className="notification-item-icon">
                    {getIcon(notification.icon)}
                  </div>

                  <div className="notification-item-content">

                    <div className="notification-item-title">
                      <h3>{notification.title}</h3>
                      {!notification.read && (
                        <span className="unread-dot" />
                      )}
                    </div>

                    <p>{notification.message}</p>

                    <div className="notification-item-meta">
                      <span>{notification.date}</span>
                      <span>{notification.type}</span>
                    </div>

                  </div>

                  <div className="notification-item-actions">

                    {!notification.read && (
                      <button
                        type="button"
                        title="Mark as read"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check />
                      </button>
                    )}

                    <button
                      type="button"
                      title="Delete notification"
                      onClick={() =>
                        deleteNotification(notification.id)
                      }
                    >
                      <Trash2 />
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