import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('goeazy_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('goeazy_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('goeazy_user');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('goeazy_user');
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const updatedUser = { ...currentUser, ...updatedData };
      setCurrentUser(updatedUser);
      localStorage.setItem('goeazy_user', JSON.stringify(updatedUser));

      try {
        const regUsers = JSON.parse(localStorage.getItem('gem_registered_users') || '[]');
        const idx = regUsers.findIndex(u => u.id === updatedUser.id || u.email === updatedUser.email);
        if (idx !== -1) {
          regUsers[idx] = { ...regUsers[idx], ...updatedData };
          localStorage.setItem('gem_registered_users', JSON.stringify(regUsers));
        }
      } catch (e) {
        console.error('Storage sync error:', e);
      }

      return { success: true, user: updatedUser };
    } finally {
      setLoading(false);
    }
  };

  // Quick switch for testing and demo purposes
  const switchRole = async (email, password) => {
    return login(email, password);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, updateProfile, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
