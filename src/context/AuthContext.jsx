import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const fetchUser = useCallback(async (token) => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users/me/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token inválido o expirado, cerrando sesión.", error);
      logout(); 
    } finally {
        setLoading(false); 
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const refreshUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      await fetchUser(token);
    }
  };

  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };
  
  const login = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    fetchUser(accessToken);
  };

  const value = { user, isAuthenticated, loading, login, logout, getAccessToken, refreshUser };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}