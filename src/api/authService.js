import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (data) => {
    const response = await API.post('/auth/login', data);
    return response.data;
  },
  register: async (data) => {
    const response = await API.post('/auth/register', data);
    return response.data;
  },
  googleLogin: async (token) => {
    const response = await API.post('/auth/google', { token });
    return response.data;
  },
};