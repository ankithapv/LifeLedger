
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";

import { useAuth } from "./AuthContext";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  markNotificationAsUnread
} from "../services/notificationService";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate unread notification count
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Fetch notifications from FastAPI backend
  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getNotifications();

      const formattedNotifications = response.map((notification) => ({
        ...notification,

        isRead: notification.is_read,
        createdAt: notification.created_at,
        expiryDate: notification.expiry_date,
        notificationType: notification.notification_type,

        read: notification.is_read,
        date: notification.created_at,
        type: "Reminder",
        icon: "clock"
      }));

      setNotifications(formattedNotifications);

    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch notifications after login and automatically every 30 seconds
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setNotifications([]);
      setError(null);
      return;
    }

    // Fetch immediately after login
    refreshNotifications();

    // Automatically check for new notifications every 30 seconds
    const intervalId = window.setInterval(() => {
      refreshNotifications();
    }, 30000);

    // Stop checking when the provider is removed or user logs out
    return () => {
      window.clearInterval(intervalId);
    };

  }, [isAuthenticated, authLoading, refreshNotifications]);

  // Mark one notification as read in the backend
  const markAsRead = async (notificationId) => {
  const notification = notifications.find(
    (item) => item.id === notificationId
  );

  if (!notification) return;

  try {
    if (notification.isRead) {
      await markNotificationAsUnread(notificationId);
    } else {
      await markNotificationAsRead(notificationId);
    }

    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notificationId
          ? {
              ...item,
              isRead: !notification.isRead,
              read: !notification.isRead,
              is_read: !notification.isRead
            }
          : item
      )
    );
  } catch (error) {
    console.error("Failed to update notification:", error);
    throw error;
  }
};

  // Mark all unread notifications as read
  const markAllAsRead = async () => {
  try {
    await markAllNotificationsAsRead();

    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        isRead: true,
        read: true,
        is_read: true
      }))
    );
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    throw error;
  }
};

  // Add a temporary notification to the frontend
  const addNotification = (notification) => {
    setNotifications((previous) => [
      {
        ...notification,
        id: Date.now(),
        isRead: false,
        read: false,
        createdAt: new Date().toISOString()
      },
      ...previous
    ]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        unreadCount,
        loading,
        error,
        refreshNotifications,
        addNotification,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}

