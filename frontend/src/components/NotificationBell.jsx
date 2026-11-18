
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

import { useNotifications } from "../context/NotificationContext";

import "../styles/NotificationBell.css";

function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    markAllAsRead,
    loading
  } = useNotifications();

  const closePanel = () => setOpen(false);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Unable to mark all notifications as read:", error);
    }
  };

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

              <button
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
              >
                <Check size={13} />
                Mark all read
              </button>
            </div>

            <div className="ll-notification-list">

              {loading ? (
                <div className="ll-notification-empty">
                  <p>Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="ll-notification-empty">
                  <Bell size={28} />
                  <h4>All caught up!</h4>
                  <p>No notifications right now.</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className={`ll-notification-item ${
                      !item.isRead ? "unread" : ""
                    }`}
                  >
                    <div className={`ll-notification-icon ${item.type}`}>
                      {getIcon(item.type)}
                    </div>

                    <div className="ll-notification-content">
                      <h4>{item.title}</h4>
                      <p>{item.message}</p>
                      <span>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : ""}
                      </span>
                    </div>

                    {!item.isRead && (
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
