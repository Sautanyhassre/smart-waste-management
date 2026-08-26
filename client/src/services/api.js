import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smart-waste-management-08q1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smart_waste_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401s gracefully
api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    // If token invalid, clear localStorage (unless on login page)
    if (!window.location.pathname.includes('/login')) {
      localStorage.removeItem('smart_waste_token');
      localStorage.removeItem('smart_waste_user');
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default api;
