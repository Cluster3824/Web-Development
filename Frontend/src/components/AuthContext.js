import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { accessToken, refreshToken, user: userData } = response.data;
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // Set user data from login response
      if (userData) {
        setUser(userData);
      } else {
        // Fallback: Get user data from /me endpoint
        try {
          const userResponse = await authAPI.getMe();
          const newUserData = userResponse.data;
          setUser(newUserData);
          return { success: true, user: newUserData, shouldRedirectToAdmin: newUserData?.role === 'ADMIN' };
        } catch (err) {
          console.error('Failed to get user data after login:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setToken(null);
          return {
            success: false,
            error: 'Login succeeded, but failed to retrieve user details.'
          };
        }
      }
      
      return { success: true, user: userData, shouldRedirectToAdmin: userData?.role === 'ADMIN' };
    } catch (error) {
      console.error('Login failed:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('ECONNREFUSED')) {
        return { 
          success: false, 
          error: 'Backend server is not running. Please start the Spring Boot server.' 
        };
      }
      return { 
        success: false, 
        error: error.response?.data || error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      return { success: true, username: userData.username };
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('ECONNREFUSED')) {
        return { 
          success: false, 
          error: 'Backend server is not running. Please start the Spring Boot server.' 
        };
      }
      return { 
        success: false, 
        error: error.response?.data || error.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
