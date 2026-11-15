import React from "react";
import { LoaderCircle } from "lucide-react";
import "../styles/LoadingSpinner.css";

function LoadingSpinner({ message = "Loading...", fullScreen = false }) {
  return (
    <div className={`ll-loading ${fullScreen ? "ll-loading-fullscreen" : ""}`}>
      <div className="ll-loading-icon">
        <LoaderCircle size={30} />
      </div>
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;