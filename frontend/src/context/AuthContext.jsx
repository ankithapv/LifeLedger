import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import {
  loginUser,
  getUserProfile,
  logoutUser
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("access_token") || null
  );

  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token);

  // Restore user session after refreshing the website
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem("access_token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile();
        setUser(profile);
        setToken(savedToken);
      } catch (error) {
        logoutUser();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login using backend API
  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const accessToken = response.access_token;

    setToken(accessToken);

    try {
      const profile = await getUserProfile();
      setUser(profile);
      return profile;
    } catch (error) {
      logoutUser();
      setToken(null);
      setUser(null);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}