import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await API.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to authenticate token:', err);
        // Fallback for local session if offline
        const savedUser = localStorage.getItem('user_profile');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token: authToken, user: userData, message } = response.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user_profile', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
      showToast(message || 'Welcome back!', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || (err.code === 'ERR_NETWORK' || !err.response ? 'Cannot connect to server. Please ensure the backend is running.' : 'Login failed. Please check credentials.');
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await API.post('/auth/register', { name, email, password });
      const { token: authToken, user: userData, message } = response.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user_profile', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
      showToast(message || 'Registration successful! Welcome.', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || (err.code === 'ERR_NETWORK' || !err.response ? 'Cannot connect to server. Please ensure the backend is running.' : 'Registration failed. Please try again.');
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_profile');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        toast,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
