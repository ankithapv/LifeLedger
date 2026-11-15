import React from "react";
import { Bot, User, Copy, Check } from "lucide-react";
import "../styles/AssistantMessage.css";

function AssistantMessage({ message, isUser = false, timestamp }) {
  const [copied, setCopied] = React.useState(false);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      console.error("Unable to copy message");
    }
  };

  return (
    <div className={`ll-message-row ${isUser ? "user-message" : "ai-message"}`}>
      <div className="ll-message-avatar">
        {isUser ? <User size={18} /> : <Bot size={19} />}
      </div>

      <div className="ll-message-content">
        <div className="ll-message-heading">
          <span>{isUser ? "You" : "LifeLedger AI"}</span>
          {timestamp && <small>{timestamp}</small>}
        </div>

        <div className="ll-message-bubble">
          <p>{message}</p>
          {!isUser && (
            <button
              className="ll-message-copy"
              onClick={copyMessage}
              title="Copy message"
              type="button"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssistantMessage;