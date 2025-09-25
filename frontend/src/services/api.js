import axios from 'axios';

const API_URL = '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests automatically
apiClient.interceptors.request.use(
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

// Handle response errors globally
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

// Expense API functions
export const expenseAPI = {
  // Get all expenses with optional filters
  getExpenses: (params = {}) => {
    return apiClient.get('/expenses', { params });
  },

  // Get single expense
  getExpense: (id) => {
    return apiClient.get(`/expenses/${id}`);
  },

  // Create new expense
  createExpense: (data) => {
    return apiClient.post('/expenses', data);
  },

  // Update expense
  updateExpense: (id, data) => {
    return apiClient.put(`/expenses/${id}`, data);
  },

  // Delete expense
  deleteExpense: (id) => {
    return apiClient.delete(`/expenses/${id}`);
  },

  // Get expense statistics
  getStats: () => {
    return apiClient.get('/expenses/stats/summary');
  }
};

// Auth API functions
export const authAPI = {
  // Login
  login: (data) => {
    return apiClient.post('/auth/login', data);
  },

  // Register
  register: (data) => {
    return apiClient.post('/auth/register', data);
  },

  // Get profile
  getProfile: () => {
    return apiClient.get('/auth/profile');
  }
};

export default apiClient;