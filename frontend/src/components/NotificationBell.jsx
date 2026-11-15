import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  FileClock,
  ShieldAlert,
  FileCheck,
  Check,
  ArrowRight,
  X
} from "lucide-react";

import "../styles/NotificationBell.css";

function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Document expiring soon",
      message: "Your insurance policy needs renewal soon.",
      time: "2 hours ago",
      type: "warning",
      read: false
    },
    {
      id: 2,
      title: "Document uploaded",
      message: "Your new certificate was uploaded successfully.",
      time: "Yesterday",
      type: "success",
      read: false
    },
    {
      id: 3,
      title: "Expiry reminder",
      message: "A document is approaching its expiry date.",
      time: "2 days ago",
      type: "reminder",
      read: true
    }
  ]);

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const markAllRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({
        ...item,
        read: true
      }))
    );
  };

  const closePanel = () => setOpen(false);

  const getIcon = (type) => {
    if (type === "warning") return <ShieldAlert size={19} />;
    if (type === "success") return <FileCheck size={19} />;
    return <FileClock size={19} />;
  };

  return (
    <div className="ll-notification-wrapper">

      <button
        className="ll-bell-button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle notifications"
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <span className="ll-bell-count">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="ll-notification-overlay"
            onClick={closePanel}
          />

          <div className="ll-notification-panel">

            <div className="ll-notification-header">
              <div>
                <h3>Notifications</h3>
                <p>
                  You have {unreadCount} unread notifications
                </p>
              </div>

              <button
                className="ll-notification-close"
                onClick={closePanel}
              >
                <X size={17} />
              </button>
            </div>

            <div className="ll-notification-toolbar">
              <span>RECENT ACTIVITY</span>

              <button onClick={markAllRead}>
                <Check size={13} />
                Mark all read
              </button>
            </div>

            <div className="ll-notification-list">

              {notifications.length === 0 ? (
                <div className="ll-notification-empty">
                  <Bell size={28} />
                  <h4>All caught up!</h4>
                  <p>No notifications right now.</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`ll-notification-item ${
                      !item.read ? "unread" : ""
                    }`}
                  >
                    <div className={`ll-notification-icon ${item.type}`}>
                      {getIcon(item.type)}
                    </div>

                    <div className="ll-notification-content">
                      <h4>{item.title}</h4>
                      <p>{item.message}</p>
                      <span>{item.time}</span>
                    </div>

                    {!item.read && (
                      <span className="ll-unread-dot" />
                    )}
                  </div>
                ))
              )}

            </div>

            <button
              className="ll-view-all"
              onClick={() => {
                closePanel();
                navigate("/notifications");
              }}
            >
              View all notifications
              <ArrowRight size={16} />
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default NotificationBell;