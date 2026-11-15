import React from "react";
import {
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  CalendarDays,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  ShieldCheck,
  Clock,
  AlertTriangle
} from "lucide-react";
import "../styles/DocumentCard.css";

function DocumentCard({
  document,
  onView,
  onDownload,
  onDelete
}) {
  const {
    id,
    name = "Untitled Document",
    category = "Other",
    expiryDate,
    status = "active",
    fileType = "pdf"
  } = document || {};

  const getFileIcon = () => {
    if (fileType === "jpg" || fileType === "png") return FileImage;
    if (fileType === "xlsx" || fileType === "csv") return FileSpreadsheet;
    if (fileType === "pdf") return FileText;
    return File;
  };

  const FileIcon = getFileIcon();

  const statusDetails = {
    active: { label: "Active", icon: ShieldCheck },
    expiring: { label: "Expiring Soon", icon: Clock },
    expired: { label: "Expired", icon: AlertTriangle }
  };

  const currentStatus = statusDetails[status] || statusDetails.active;
  const StatusIcon = currentStatus.icon;

  const formatDate = (date) => {
    if (!date) return "No expiry date";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Date unavailable";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <article className="ll-document-card">
      <div className="ll-document-header">
        <div className={`ll-document-file-icon ${fileType}`}>
          <FileIcon size={25} />
        </div>

        <button
          className="ll-document-menu"
          type="button"
          aria-label="Document options"
          onClick={() => onView && onView(id)}
        >
          <MoreVertical size={19} />
        </button>
      </div>

      <div className="ll-document-info">
        <span className="ll-document-category">{category}</span>
        <h3 title={name}>{name}</h3>
      </div>

      <div className="ll-document-expiry">
        <CalendarDays size={15} />
        <span>Expires: {formatDate(expiryDate)}</span>
      </div>

      <div className="ll-document-footer">
        <span className={`ll-document-status ${status}`}>
          <StatusIcon size={14} />
          {currentStatus.label}
        </span>

        <div className="ll-document-actions">
          <button
            type="button"
            title="View document"
            onClick={() => onView && onView(id)}
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            title="Download document"
            onClick={() => onDownload && onDownload(id)}
          >
            <Download size={16} />
          </button>

          <button
            type="button"
            title="Delete document"
            onClick={() => onDelete && onDelete(id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default DocumentCard;