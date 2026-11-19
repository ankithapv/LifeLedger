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

// Request a password reset link
export const forgotPassword = async (email) => {
  const response = await API.post("/auth/forgot-password", {
    email: email
  });

  return response.data;
};

// Reset password using the email token
export const resetPassword = async (token, newPassword) => {
  const response = await API.post("/auth/reset-password", {
    token: token,
    new_password: newPassword
  });

  return response.data;
};