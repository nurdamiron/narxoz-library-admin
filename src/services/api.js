// src/services/api.js
import axios from 'axios';
import apiDebugger from '../utils/apiDebugger';

/**
 * API клиент
 * 
 * @description Бұл модуль серверге HTTP сұраныстар жіберуге арналған
 * API клиентін жасайды және оны реттейді.
 */

// API негізгі URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axios данасын жасау
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Сұраныс интерцептор - әр сұранысқа аутентификация хедерін қосу
apiClient.interceptors.request.use(
  (config) => {
    // Егер хедерде аутентификация бар болса, оны қолдану
    if (config.headers['Authorization']) {
      return config;
    }
    
    // Жоқ болса, localStorage-дан мәліметтерді алу
    const username = localStorage.getItem('auth_username');
    const password = localStorage.getItem('auth_password');
    
    // Отладка үшін аутентификация мәліметтерін журналға жазу
    console.log('Auth credentials:', username, password);
    
    if (username && password) {
      // Basic аутентификация хедерін жасау
      config.headers['Authorization'] = 'Basic ' + btoa(`${username}:${password}`);
      
      // Админ үшін арнайы жағдай
      if (username === 'admin@narxoz.kz') {
        config.headers['X-User-Role'] = 'admin';
      }
    }
    
    // Отладка үшін сұранысты журналға жазу
    apiDebugger.logRequest(config.url, config.method, config.data);
    console.log('Request headers:', config.headers);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Жауап интерцептор - қателерді өңдеу және журналға жазу
apiClient.interceptors.response.use(
  (response) => {
    // Сәтті жауапты журналға жазу
    apiDebugger.logResponse(response.config.url, response);
    return response;
  },
  (error) => {
    // Қатені журналға жазу
    apiDebugger.logError(error.config?.url || 'unknown endpoint', error);
    
    // Аутентификация қателерін өңдеу
    if (error.response && error.response.status === 401) {
      // Аутентификация мәліметтерін тазалау
      localStorage.removeItem('auth_username');
      localStorage.removeItem('auth_password');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('isAuthenticated');
      
      // Егер кіру бетінде болмасақ, сол бетке қайта бағыттау
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API клиентінің негізгі әдістері
const api = {
  /**
   * GET сұранысы
   * 
   * @param {string} url - Сұраныс URL-і
   * @param {Object} params - Сұраныс параметрлері
   * @returns {Promise} Сұраныс нәтижесі
   */
  get: async (url, params = {}) => {
    try {
      const response = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`GET ${url} қатесі:`, error);
      throw error;
    }
  },
  
  /**
   * POST сұранысы
   * 
   * @param {string} url - Сұраныс URL-і
   * @param {Object} data - Сұраныс денесі
   * @returns {Promise} Сұраныс нәтижесі
   */
  post: async (url, data = {}) => {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} қатесі:`, error);
      throw error;
    }
  },
  
  /**
   * PUT сұранысы
   * 
   * @param {string} url - Сұраныс URL-і
   * @param {Object} data - Сұраныс денесі
   * @returns {Promise} Сұраныс нәтижесі
   */
  put: async (url, data = {}) => {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} қатесі:`, error);
      throw error;
    }
  },
  
  /**
   * DELETE сұранысы
   * 
   * @param {string} url - Сұраныс URL-і
   * @returns {Promise} Сұраныс нәтижесі
   */
  delete: async (url) => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} қатесі:`, error);
      throw error;
    }
  },
  
  /**
   * Файл жүктеу
   * 
   * @param {string} url - Сұраныс URL-і
   * @param {FormData} formData - Жүктелетін файл(дар)
   * @param {Function} onProgress - Прогресс колбэгі
   * @returns {Promise} Сұраныс нәтижесі
   */
  uploadFile: async (url, formData, onProgress) => {
    try {
      // Авторизация заголовкаларын алу
      const username = localStorage.getItem('auth_username');
      const password = localStorage.getItem('auth_password');
      
      let headers = {
        'Content-Type': 'multipart/form-data'
      };
      
      if (username && password) {
        headers['Authorization'] = 'Basic ' + btoa(`${username}:${password}`);
      }
      
      const response = await apiClient.post(url, formData, {
        headers,
        onUploadProgress: progressEvent => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`File upload to ${url} қатесі:`, error);
      throw error;
    }
  },
  
  /**
   * API клиент данасын алу
   * @returns {Object} Axios данасы
   */
  getInstance: () => apiClient
};

export default api;