import React from "react";
import {
  AlertTriangle,
  Clock,
  CalendarDays,
  ArrowRight,
  X
} from "lucide-react";
import "../styles/ExpiryAlert.css";

function ExpiryAlert({
  document,
  onView,
  onDismiss
}) {
  const {
    id,
    name = "Untitled Document",
    expiryDate,
    daysRemaining
  } = document || {};

  const isExpired = daysRemaining < 0;

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Date unavailable";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className={`ll-expiry-alert ${isExpired ? "expired" : "warning"}`}>
      <div className="ll-expiry-alert-icon">
        {isExpired ? (
          <AlertTriangle size={21} />
        ) : (
          <Clock size={21} />
        )}
      </div>

      <div className="ll-expiry-alert-content">
        <h4>{isExpired ? "Document Expired" : "Expiry Reminder"}</h4>

        <p className="ll-expiry-document-name">{name}</p>

        <div className="ll-expiry-alert-meta">
          <span>
            <CalendarDays size={13} />
            {formatDate(expiryDate)}
          </span>

          <strong>
            {daysRemaining === undefined
              ? "Date pending"
              : isExpired
              ? `${Math.abs(daysRemaining)} days overdue`
              : daysRemaining === 0
              ? "Expires today"
              : `${daysRemaining} days remaining`}
          </strong>
        </div>

        <button
          type="button"
          className="ll-expiry-view-button"
          onClick={() => onView && onView(id)}
        >
          View document <ArrowRight size={14} />
        </button>
      </div>

      {onDismiss && (
        <button
          type="button"
          className="ll-expiry-dismiss"
          onClick={() => onDismiss(id)}
          aria-label="Dismiss alert"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}

export default ExpiryAlert;