
import React, { useState, useRef, useEffect } from "react";

import {
  Bot,
  Send,
  User,
  Sparkles,
  Plus,
  Trash2
} from "lucide-react";

import { sendAssistantMessage } from "../services/assistantService";

import "../styles/Assistant.css";

function Assistant() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const suggestions = [
    "Which documents are expiring soon?",
    "Show my expired documents",
    "Find my insurance policy",
    "How many documents do I have?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  // Send message to LifeLedger AI backend
  const sendMessage = async (question = input) => {

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedQuestion
    };

    setMessages((previous) => [
      ...previous,
      userMessage
    ]);

    setInput("");
    setLoading(true);

    try {

      // Send question to FastAPI backend
      const response = await sendAssistantMessage(
        trimmedQuestion
      );

      // Get AI-generated answer
      const assistantMessage = {
        id: Date.now() + 1,
        sender: "assistant",
        text: response.reply || "Sorry, I could not generate a response."
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage
      ]);

    } catch (error) {

      console.error("Assistant API Error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        sender: "assistant",
        text: error.response?.data?.detail ||
          "Sorry, something went wrong. Please try again."
      };

      setMessages((previous) => [
        ...previous,
        errorMessage
      ]);

    } finally {

      setLoading(false);

    }
  };

  // Start a new conversation
  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setLoading(false);
  };

  // Clear current chat
  const clearChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="assistant-page">

      <main className="assistant-main">

        {/* Header */}
        <header className="assistant-header">

          <div className="assistant-header-title">

            <div className="assistant-header-icon">
              <Bot />
            </div>

            <div>
              <h1>LifeLedger AI</h1>

              <p>
                <span />
                Your personal document assistant
              </p>
            </div>

          </div>

          <div className="assistant-ai-label">
            <Sparkles /> AI Assistant
          </div>

        </header>

        {/* Chat area */}
        <section className="assistant-chat">

          <div className="assistant-messages">

            {messages.length === 0 && (

              <div className="assistant-welcome">

                <div className="assistant-welcome-icon">
                  <Sparkles />
                </div>

                <h2>How can I help you today?</h2>

                <p>
                  Ask questions about your documents,
                  expiry dates, insurance policies and more.
                </p>

              </div>

            )}

            {/* Display chat messages */}
            {messages.map((message) => (

              <div
                key={message.id}
                className={`assistant-message ${message.sender}`}
              >

                <div className="assistant-message-avatar">

                  {message.sender === "assistant"
                    ? <Bot />
                    : <User />}

                </div>

                <div className="assistant-message-content">

                  <span>
                    {message.sender === "assistant"
                      ? "LifeLedger AI"
                      : "You"}
                  </span>

                  <p>{message.text}</p>

                </div>

              </div>

            ))}

            {/* Loading indicator */}
            {loading && (

              <div className="assistant-message assistant">

                <div className="assistant-message-avatar">
                  <Bot />
                </div>

                <div className="assistant-message-content">
                  <span>LifeLedger AI</span>
                  <p className="assistant-typing">
                    Thinking...
                  </p>
                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Suggested questions */}
          {messages.length === 0 && (

            <div className="assistant-suggestions">

              <h3>
                <Sparkles /> Try asking
              </h3>

              <div>

                {suggestions.map((suggestion) => (

                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    disabled={loading}
                  >
                    {suggestion}
                  </button>

                ))}

              </div>

            </div>

          )}

          {/* Message input */}
          <form
            className="assistant-input-area"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >

            <input
              type="text"
              placeholder="Ask about your documents..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
            >
              <Send />
            </button>

          </form>

          <p className="assistant-disclaimer">
            LifeLedger AI provides answers based on your
            personal document records.
          </p>

        </section>

        {/* Chat controls */}
        <div className="assistant-chat-controls">

          <button
            type="button"
            onClick={startNewChat}
            disabled={loading}
          >
            <Plus /> New Conversation
          </button>

          <button
            type="button"
            onClick={clearChat}
            disabled={loading}
          >
            <Trash2 /> Clear Chat
          </button>

        </div>

      </main>

    </div>
  );
}

export default Assistant;
