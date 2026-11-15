import React from "react";
import {
  CalendarDays,
  Clock,
  ArrowRight,
  BellRing,
  ShieldAlert
} from "lucide-react";
import "../styles/UpcomingReminders.css";

function UpcomingReminders({ reminders = [], onViewAll, onReminderClick }) {
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Date unavailable";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <section className="ll-reminders-card">
      <div className="ll-reminders-header">
        <div>
          <span className="ll-reminders-eyebrow">STAY PREPARED</span>
          <h3>Upcoming Reminders</h3>
          <p>Never miss an important renewal.</p>
        </div>

        <div className="ll-reminders-header-icon">
          <BellRing size={20} />
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="ll-reminders-empty">
          <div className="ll-reminders-empty-icon">
            <CalendarDays size={25} />
          </div>
          <h4>You're all caught up!</h4>
          <p>No upcoming reminders at the moment.</p>
        </div>
      ) : (
        <div className="ll-reminders-list">
          {reminders.slice(0, 4).map((reminder, index) => (
            <div
              className="ll-reminder-item"
              key={reminder.id || index}
              onClick={() => onReminderClick && onReminderClick(reminder)}
              role={onReminderClick ? "button" : undefined}
              tabIndex={onReminderClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onReminderClick && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onReminderClick(reminder);
                }
              }}
            >
              <div className="ll-reminder-date-icon">
                {reminder.daysRemaining <= 7 ? (
                  <ShieldAlert size={19} />
                ) : (
                  <CalendarDays size={19} />
                )}
              </div>

              <div className="ll-reminder-info">
                <h4>{reminder.documentName || "Untitled Document"}</h4>
                <span>
                  <Clock size={12} />
                  {formatDate(reminder.expiryDate)}
                </span>
              </div>

              <span
                className={`ll-reminder-days ${
                  reminder.daysRemaining <= 7 ? "urgent" : ""
                }`}
              >
                {reminder.daysRemaining === undefined
                  ? "Pending"
                  : reminder.daysRemaining < 0
                  ? "Overdue"
                  : reminder.daysRemaining === 0
                  ? "Today"
                  : `${reminder.daysRemaining} days`}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="ll-reminders-view-all"
        onClick={onViewAll}
      >
        View all reminders <ArrowRight size={15} />
      </button>
    </section>
  );
}

export default UpcomingReminders;