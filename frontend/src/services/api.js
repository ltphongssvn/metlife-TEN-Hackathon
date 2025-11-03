// /metlife-TEN-Hackathon/frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
    timeout: 60000,
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
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Export individual functions for cleaner imports
export const sendMessage = (message, conversationId, language = 'en') =>
    apiClient.post('/chat', { message, conversationId, language });

export const getConversationHistory = () =>
    apiClient.get('/conversations/current');

export const clearConversation = () =>
    apiClient.delete('/conversations/current');

export const api = {
    // Health check
    healthCheck: () => axios.get(`${API_BASE_URL}/health`),

    // Chat endpoints
    sendMessage: (message, conversationId, language = 'en') =>
        apiClient.post('/chat', { message, conversationId, language }),

    // Conversation endpoints
    getConversations: () => apiClient.get('/conversations'),
    getConversation: (id) => apiClient.get(`/conversations/${id}`),
    getConversationMessages: (id) => apiClient.get(`/conversations/${id}/messages`),
    getConversationHistory: () => apiClient.get('/conversations/current'),
    clearConversation: () => apiClient.delete('/conversations/current'),

    // Auth - no interceptor needed, returns data directly
    post: (endpoint, data) => apiClient.post(endpoint, data),
};

export default apiClient;