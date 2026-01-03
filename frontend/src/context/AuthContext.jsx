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
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        // 2. Set the header for ALL subsequent requests
        api.defaults.headers.common["x-auth-token"] = storedToken;
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Invalid token - Session cleared", error);
          logout(); // Use the logout function to clean up
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const newToken = res.data.token;

      // CHANGE: Apply token to Axios immediately so next calls work
      api.defaults.headers.common["x-auth-token"] = newToken;

      localStorage.setItem("token", newToken);
      setToken(newToken);

      // OPTIONAL: Immediately fetch user data after login to sync state
      const userRes = await api.get("/auth/me");
      setUser(userRes.data);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.msg || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const newToken = res.data.token;

      // CHANGE: Apply token to Axios immediately
      api.defaults.headers.common["x-auth-token"] = newToken;

      localStorage.setItem("token", newToken);
      setToken(newToken);

      const userRes = await api.get("/auth/me");
      setUser(userRes.data);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
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
      {!loading && children}
    </AuthContext.Provider>
  );
};
