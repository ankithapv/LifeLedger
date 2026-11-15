import React from "react";
import {
  Upload,
  FileCheck,
  Trash2,
  RefreshCw,
  Eye,
  Clock
} from "lucide-react";
import "../styles/RecentActivity.css";

const activityIcons = {
  upload: Upload,
  update: FileCheck,
  delete: Trash2,
  renew: RefreshCw,
  view: Eye
};

function RecentActivity({ activities = [] }) {
  const formatTime = (date) => {
    if (!date) return "Recently";

    const activityDate = new Date(date);

    if (Number.isNaN(activityDate.getTime())) return "Recently";

    return activityDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <section className="ll-activity-card">
      <div className="ll-activity-heading">
        <div>
          <span className="ll-activity-eyebrow">YOUR WORKSPACE</span>
          <h3>Recent Activity</h3>
          <p>Keep track of what's happening with your documents.</p>
        </div>

        <div className="ll-activity-heading-icon">
          <Clock size={19} />
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="ll-activity-empty">
          <div className="ll-activity-empty-icon">
            <Clock size={23} />
          </div>
          <h4>No activity yet</h4>
          <p>Your document activities will appear here.</p>
        </div>
      ) : (
        <div className="ll-activity-list">
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type] || FileCheck;

            return (
              <div className="ll-activity-item" key={activity.id || index}>
                <div className={`ll-activity-icon ${activity.type || "update"}`}>
                  <Icon size={17} />
                </div>

                <div className="ll-activity-details">
                  <h4>{activity.title || "Document activity"}</h4>
                  <p>{activity.description || "A document was updated."}</p>
                  <span>{formatTime(activity.date)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RecentActivity;