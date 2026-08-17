import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smart_waste_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smart_waste_token') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('smart_waste_token', token);
    } else {
      localStorage.removeItem('smart_waste_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smart_waste_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smart_waste_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const loginAsDemoRole = async (role) => {
    const creds = {
      admin: { email: 'admin@smartwaste.gov.in', password: 'admin123' },
      staff: { email: 'staff@smartwaste.gov.in', password: 'staff123' },
      viewer: { email: 'viewer@smartwaste.gov.in', password: 'viewer123' }
    };
    const c = creds[role] || creds.admin;
    return await login(c.email, c.password);
  };

  const registerUser = async (name, email, password, role, phone, zone) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', { name, email, password, role, phone, zone });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Registration failed. Please check inputs.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('smart_waste_token');
    localStorage.removeItem('smart_waste_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      registerUser,
      loginAsDemoRole,
      logout,
      isAdmin: user?.role === 'admin',
      isStaff: user?.role === 'staff',
      isViewer: user?.role === 'viewer'
    }}>
      {children}
    </AuthContext.Provider>
  );
};
