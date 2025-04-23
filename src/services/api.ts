import axios from 'axios';

const API_URL = import.meta.env.PROD 
  ? '/api'  // In production, use relative path
  : 'http://localhost:3000/api';  // In development, connect to dev server

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authorization header for admin routes
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  
  if (token && config.url?.includes('/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;