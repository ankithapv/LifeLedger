import React from "react";
import { AlertTriangle, X } from "lucide-react";
import "../styles/ConfirmDialog.css";

function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = true
}) {
  if (!isOpen) return null;

  return (
    <div className="ll-dialog-overlay" onClick={onCancel}>
      <div
        className="ll-confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="ll-dialog-close"
          onClick={onCancel}
          type="button"
          aria-label="Close dialog"
        >
          <X size={19} />
        </button>

        <div className={`ll-dialog-icon ${danger ? "danger" : "normal"}`}>
          <AlertTriangle size={27} />
        </div>

        <h2>{title}</h2>
        <p>{message}</p>

        <div className="ll-dialog-actions">
          <button
            className="ll-dialog-cancel"
            onClick={onCancel}
            type="button"
          >
            {cancelText}
          </button>

          <button
            className={`ll-dialog-confirm ${danger ? "danger" : "normal"}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;