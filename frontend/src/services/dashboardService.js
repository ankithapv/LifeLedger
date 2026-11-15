import API from "./api";

// Get dashboard statistics
export const getDashboardStats = async () => {
  const response = await API.get("/dashboard/stats");
  return response.data;
};

// Get document category statistics
export const getCategoryStats = async () => {
  const response = await API.get("/dashboard/categories");
  return response.data;
};

// Get recent activities
export const getRecentActivities = async () => {
  const response = await API.get("/dashboard/activity");
  return response.data;
};

// Get upcoming reminders
export const getUpcomingReminders = async () => {
  const response = await API.get("/dashboard/upcoming-reminders");
  return response.data;
};

// Get document health score
export const getDocumentHealthScore = async () => {
  const response = await API.get("/dashboard/health-score");
  return response.data;
};

export default {
  getDashboardStats,
  getCategoryStats,
  getRecentActivities,
  getUpcomingReminders,
  getDocumentHealthScore
};