import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Helper to decode token and set user
  const handleToken = (jwtToken) => {
    if (jwtToken) {
      try {
        const decoded = jwtDecode(jwtToken);
        // decoded format: { userId, role, email, exp, ... }
        // check expiry
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return false;
        }
        setUser({
          id: decoded.userId,
          role: decoded.role || 'Patient',
          email: decoded.email,
          name: decoded.name || 'User',
        });
        setToken(jwtToken);
        localStorage.setItem('token', jwtToken);
        return true;
      } catch (error) {
        logout();
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      handleToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Periodic check for token expiry
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          }
        } catch {
          logout();
        }
      }, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [token]);

  const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data && response.data.token) {
      handleToken(response.data.token);
      // Backend returns data: { _id, name, email, role, subscriptionPlan }
      if (response.data.data) {
        setUser((prev) => ({
          ...prev,
          name: response.data.data.name,
          role: response.data.data.role || 'Patient',
          subscriptionPlan: response.data.data.subscriptionPlan || 'Free',
        }));
      }
    }
    return response.data;
  };

  const register = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  };

  const googleLogin = async (googleAccessToken) => {
    const response = await axios.post(`${API_URL}/auth/google`, { token: googleAccessToken });
    if (response.data && response.data.token) {
      handleToken(response.data.token);
      if (response.data.data) {
        setUser((prev) => ({
          ...prev,
          name: response.data.data.name,
          role: response.data.data.role || 'Patient',
          subscriptionPlan: response.data.data.subscriptionPlan || 'Free',
        }));
      }
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
