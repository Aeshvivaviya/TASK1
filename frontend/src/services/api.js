/**
 * API Service - Centralized Axios instance for all backend calls
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds (AI generation can take time)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - log outgoing requests in dev
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    return Promise.reject({ ...error, userMessage: message });
  }
);

/**
 * Submit a new job application
 * @param {Object} formData - Candidate form data
 */
export const submitApplication = async (formData) => {
  const response = await api.post('/apply', formData);
  return response.data;
};

/**
 * Fetch all candidates (admin)
 * @param {Object} params - { page, limit, status, search }
 */
export const fetchCandidates = async (params = {}) => {
  const response = await api.get('/admin/candidates', { params });
  return response.data;
};

/**
 * Fetch admin dashboard stats
 */
export const fetchStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

/**
 * Update candidate status
 * @param {string} id - Candidate ID
 * @param {string} status - New status
 */
export const updateStatus = async (id, status) => {
  const response = await api.patch(`/admin/candidates/${id}/status`, { status });
  return response.data;
};

/**
 * Resend task email to a candidate
 * @param {string} id - Candidate ID
 */
export const resendEmail = async (id) => {
  const response = await api.post(`/admin/candidates/${id}/resend-email`);
  return response.data;
};

export default api;
