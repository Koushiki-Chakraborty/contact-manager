import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        api.defaults.headers.common["x-auth-token"] = token;
        try {
            // Verify token and get user data
            const res = await api.get('/auth/me');
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
          console.error("Invalid token", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          delete api.defaults.headers.common["x-auth-token"];
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      return {
        success: false,
        message: error.response?.data?.msg || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Registration failed", error);
      return {
        success: false,
        message: error.response?.data?.msg || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["x-auth-token"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
