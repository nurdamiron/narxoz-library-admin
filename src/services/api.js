// src/services/api.js
import axios from 'axios';

/**
 * API Client for making HTTP requests to the server
 */

// API base URL - use environment variable or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Create Basic Auth header
 * 
 * @param {string} username - User email/username
 * @param {string} password - Password
 * @returns {string} - Basic Auth header value
 */
const createBasicAuthHeader = (username, password) => {
  if (!username || !password) {
    console.warn('Missing username or password for Basic Auth');
    return null;
  }
  return 'Basic ' + btoa(`${username}:${password}`);
};

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
  (config) => {
    // If auth headers already exist, use them
    if (config.headers['Authorization']) {
      return config;
    }
    
    // Get credentials from localStorage
    const username = localStorage.getItem('auth_username');
    const password = localStorage.getItem('auth_password');
    
    // Add authorization header if credentials exist
    if (username && password) {
      config.headers['Authorization'] = createBasicAuthHeader(username, password);
      
      // Special case for admin user
      if (username === 'admin@narxoz.kz') {
        config.headers['X-User-Role'] = 'admin';
      }
    }
    
    // For debugging - log the request
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    // If the API returns data in a specific structure, standardize it
    if (response.data && response.data.hasOwnProperty('success')) {
      return response.data;
    }
    
    // Otherwise, wrap the response in a standard format
    return { 
      success: true, 
      data: response.data,
      status: response.status
    };
  },
  (error) => {
    // Log error details
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API error:`, {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear authentication data
      localStorage.removeItem('auth_username');
      localStorage.removeItem('auth_password');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('isAuthenticated');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        console.log('Session expired. Redirecting to login page...');
        // Use a small delay to allow the current code to complete
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }
    
    // Return a standardized error response
    return Promise.reject({
      ...error,
      formattedError: {
        success: false,
        message: error.response?.data?.message || error.message || 'Unknown error',
        status: error.response?.status || 500
      }
    });
  }
);

// API client methods
const api = {
  /**
   * GET request
   * 
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} Request result
   */
  get: async (url, options = {}) => {
    try {
      const response = await apiClient.get(url, options);
      return response;
    } catch (error) {
      console.error(`GET ${url} error:`, error.formattedError || error);
      throw error.formattedError || error;
    }
  },
  
  /**
   * POST request
   * 
   * @param {string} url - Request URL
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise} Request result
   */
  post: async (url, data = {}, options = {}) => {
    try {
      const response = await apiClient.post(url, data, options);
      return response;
    } catch (error) {
      console.error(`POST ${url} error:`, error.formattedError || error);
      throw error.formattedError || error;
    }
  },
  
  /**
   * PUT request
   * 
   * @param {string} url - Request URL
   * @param {Object} data - Request body
   * @param {Object} options - Request options
   * @returns {Promise} Request result
   */
  put: async (url, data = {}, options = {}) => {
    try {
      const response = await apiClient.put(url, data, options);
      return response;
    } catch (error) {
      console.error(`PUT ${url} error:`, error.formattedError || error);
      throw error.formattedError || error;
    }
  },
  
  /**
   * DELETE request
   * 
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} Request result
   */
  delete: async (url, options = {}) => {
    try {
      const response = await apiClient.delete(url, options);
      return response;
    } catch (error) {
      console.error(`DELETE ${url} error:`, error.formattedError || error);
      throw error.formattedError || error;
    }
  },
  
  /**
   * File upload
   * 
   * @param {string} url - Request URL
   * @param {FormData} formData - Form data with files
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Request result
   */
  uploadFile: async (url, formData, onProgress) => {
    try {
      // Get auth headers
      const username = localStorage.getItem('auth_username');
      const password = localStorage.getItem('auth_password');
      
      let headers = {
        'Content-Type': 'multipart/form-data'
      };
      
      if (username && password) {
        headers['Authorization'] = createBasicAuthHeader(username, password);
      }
      
      const response = await apiClient.post(url, formData, {
        headers,
        onUploadProgress: onProgress ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        } : undefined
      });
      
      return response;
    } catch (error) {
      console.error(`File upload to ${url} error:`, error.formattedError || error);
      throw error.formattedError || error;
    }
  },
  
  /**
   * Get API client instance
   * @returns {Object} Axios instance
   */
  getInstance: () => apiClient,
  
  /**
   * Get API base URL
   * @returns {string} API base URL
   */
  getBaseUrl: () => API_URL
};

export default api;