import API from "./api";

// Get all reminders
export const getReminders = async () => {
  const response = await API.get("/reminders");
  return response.data;
};

// Create a reminder
export const createReminder = async (reminderData) => {
  const response = await API.post("/reminders", reminderData);
  return response.data;
};

// Update a reminder
export const updateReminder = async (reminderId, reminderData) => {
  const response = await API.put(
    `/reminders/${reminderId}`,
    reminderData
  );

  return response.data;
};

// Mark a reminder as completed
export const completeReminder = async (reminderId) => {
  const response = await API.patch(
    `/reminders/${reminderId}/complete`
  );

  return response.data;
};

// Mark a reminder as pending again
export const pendingReminder = async (reminderId) => {
  const response = await API.patch(
    `/reminders/${reminderId}/pending`
  );

  return response.data;
};

// Delete a reminder
export const deleteReminder = async (reminderId) => {
  const response = await API.delete(`/reminders/${reminderId}`);
  return response.data;
};

export default {
  getReminders,
  createReminder,
  updateReminder,
  completeReminder,
  pendingReminder,
  deleteReminder
};