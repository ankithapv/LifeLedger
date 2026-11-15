import API from "./api";

// Register a new user
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login an existing user
export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);

  // Save JWT token
  localStorage.setItem("access_token", response.data.access_token);

  return response.data;
};

// Get logged-in user's profile
export const getUserProfile = async () => {
  const response = await API.get("/auth/me");

  // Save user information
  localStorage.setItem("user", JSON.stringify(response.data));

  return response.data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

export const updateUserProfile = async (profileData) => {
  const response = await API.put("/auth/profile", profileData);

  localStorage.setItem("user", JSON.stringify(response.data));

  return response.data;
};