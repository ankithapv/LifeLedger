import API from "./api";

// Send a message to LifeLedger AI Assistant
export const sendAssistantMessage = async (message, conversationId = null) => {
  const response = await API.post("/assistant/chat", {
    message,
    conversation_id: conversationId
  });

  return response.data;
};

// Get previous chat conversations
export const getAssistantHistory = async () => {
  const response = await API.get("/assistant/history");
  return response.data;
};

// Get messages from a particular conversation
export const getConversationMessages = async (conversationId) => {
  const response = await API.get(
    `/assistant/history/${conversationId}`
  );

  return response.data;
};

// Start a new conversation
export const createNewConversation = async () => {
  const response = await API.post("/assistant/new-chat");
  return response.data;
};

// Delete a conversation
export const deleteConversation = async (conversationId) => {
  const response = await API.delete(
    `/assistant/history/${conversationId}`
  );

  return response.data;
};

export default {
  sendAssistantMessage,
  getAssistantHistory,
  getConversationMessages,
  createNewConversation,
  deleteConversation
};