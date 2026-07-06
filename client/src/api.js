import axios from 'axios';

const API = axios.create({
  baseURL: 'https://hse-event-training-tracker.onrender.com/api'
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;