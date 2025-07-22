import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../lib/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, ...userData } = response.data;
      
      // Validate token exists and is not empty
      if (!token || token.trim() === '') {
        throw new Error('Invalid token received from server');
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  const isAdmin = () => hasRole("ROLE_ADMIN");
  const isManager = () => hasRole("ROLE_MANAGER") || isAdmin();
  const isStaff = () => hasRole("ROLE_STAFF") || isManager();

  const value = {
    user,
    login,
    logout,
    register,
    hasRole,
    isAdmin,
    isManager,
    isStaff,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
