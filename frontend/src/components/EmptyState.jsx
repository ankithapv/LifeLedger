import React from "react";
import { FileSearch, UploadCloud, Inbox } from "lucide-react";
import "../styles/EmptyState.css";

function EmptyState({
  title = "Nothing here yet",
  message = "Your information will appear here when available.",
  icon = "inbox",
  actionLabel,
  onAction
}) {
  const icons = {
    inbox: <Inbox size={34} />,
    search: <FileSearch size={34} />,
    upload: <UploadCloud size={34} />
  };

  return (
    <div className="ll-empty-state">
      <div className="ll-empty-icon">
        {icons[icon] || icons.inbox}
      </div>

      <h3>{title}</h3>
      <p>{message}</p>

      {actionLabel && onAction && (
        <button className="ll-empty-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;