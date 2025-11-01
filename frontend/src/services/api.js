// /metlife-TEN-Hackathon/frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Health check
  healthCheck: () => axios.get(`${API_BASE_URL}/health`),
  
  // Chat endpoints
  sendMessage: (message) => apiClient.post('/chat', { message }),
  
  // Conversation endpoints
  getConversations: () => apiClient.get('/conversations'),
  getConversation: (id) => apiClient.get(`/conversations/${id}`),
};

export default apiClient;
