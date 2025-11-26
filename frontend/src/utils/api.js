import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Request interceptor - Add token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/';
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
