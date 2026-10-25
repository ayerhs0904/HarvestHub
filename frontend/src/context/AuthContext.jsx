import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('harvesthub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('harvesthub_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('harvesthub_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: jwt, ...userData } = res.data;
    localStorage.setItem('harvesthub_token', jwt);
    localStorage.setItem('harvesthub_user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: jwt, ...data } = res.data;
    localStorage.setItem('harvesthub_token', jwt);
    localStorage.setItem('harvesthub_user', JSON.stringify(data));
    setToken(jwt);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('harvesthub_token');
    localStorage.removeItem('harvesthub_user');
    setToken(null);
    setUser(null);
  };

  const isRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole || (Array.isArray(user.role) && user.role.includes(requiredRole));
  };

  const isBuyer = isRole('ROLE_BUYER');
  const isFarmer = isRole('ROLE_FARMER');
  const isAdmin = isRole('ROLE_ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isBuyer,
        isFarmer,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
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
