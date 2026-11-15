import React from "react";
import {
  CalendarDays,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import "../styles/CalendarEvent.css";

function CalendarEvent({
  event,
  onClick
}) {
  const {
    title = "Untitled Document",
    documentName,
    date,
    type = "upcoming",
    daysRemaining
  } = event || {};

  const eventTitle = documentName || title;

  const eventDetails = {
    upcoming: {
      label: "Upcoming",
      icon: Clock
    },
    expiring: {
      label: "Expiring Soon",
      icon: AlertTriangle
    },
    expired: {
      label: "Expired",
      icon: AlertTriangle
    },
    renewed: {
      label: "Renewed",
      icon: CheckCircle2
    }
  };

  const details = eventDetails[type] || eventDetails.upcoming;
  const Icon = details.icon;

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) return "Date unavailable";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <button
      type="button"
      className={`ll-calendar-event ${type}`}
      onClick={() => onClick && onClick(event)}
    >
      <div className="ll-calendar-event-icon">
        <FileText size={19} />
      </div>

      <div className="ll-calendar-event-content">
        <h4>{eventTitle}</h4>

        <span className="ll-calendar-event-date">
          <CalendarDays size={13} />
          {formatDate(date)}
        </span>

        <div className="ll-calendar-event-status">
          <Icon size={13} />
          <span>{details.label}</span>
          {daysRemaining !== undefined && (
            <span className="ll-calendar-event-days">
              {daysRemaining < 0
                ? `${Math.abs(daysRemaining)} days overdue`
                : daysRemaining === 0
                ? "Today"
                : `${daysRemaining} days left`}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default CalendarEvent;