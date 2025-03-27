/**
 * API қызметі
 * 
 * @description Бұл файл сервермен API арқылы өзара әрекеттесу үшін қажетті 
 * функцияларды қамтиды. Ол API сұраныстарын жіберуге арналған негізгі утилита болып табылады.
 */
import axios from 'axios';
import authService from './authService';
import { API_URL } from '../config/constants';

/**
 * API клиентін құру
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Сұраныс интерцепторы
 * 
 * @description Әр сұранысқа аутентификация тақырыптарын қосады
 */
apiClient.interceptors.request.use(
  config => {
    const authHeaders = authService.getAuthHeader();
    if (authHeaders) {
      config.headers = {
        ...config.headers,
        ...authHeaders
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * Жауап интерцепторы
 * 
 * @description Аутентификация қателерін өңдейді
 */
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // 401 Unauthorized қатесі - пайдаланушыны логин бетіне бағыттау
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error);
      authService.logout();
    }
    return Promise.reject(error);
  }
);

/**
 * GET сұранысы
 * 
 * @param {string} url - Сұраныс URL-і
 * @param {object} params - URL параметрлері
 * @returns {Promise<object>} - API жауабы
 */
const get = async (url, params = {}) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`GET сұранысы қатесі ${url}:`, error);
    throw error;
  }
};

/**
 * POST сұранысы
 * 
 * @param {string} url - Сұраныс URL-і
 * @param {object} data - Жіберілетін деректер
 * @returns {Promise<object>} - API жауабы
 */
const post = async (url, data = {}) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    console.error(`POST сұранысы қатесі ${url}:`, error);
    throw error;
  }
};

/**
 * PUT сұранысы
 * 
 * @param {string} url - Сұраныс URL-і
 * @param {object} data - Жіберілетін деректер
 * @returns {Promise<object>} - API жауабы
 */
const put = async (url, data = {}) => {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    console.error(`PUT сұранысы қатесі ${url}:`, error);
    throw error;
  }
};

/**
 * DELETE сұранысы
 * 
 * @param {string} url - Сұраныс URL-і
 * @returns {Promise<object>} - API жауабы
 */
const del = async (url) => {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    console.error(`DELETE сұранысы қатесі ${url}:`, error);
    throw error;
  }
};

/**
 * Файлды жүктеу
 * 
 * @param {string} url - Сұраныс URL-і
 * @param {FormData} formData - Жіберілетін формдар деректері
 * @param {Function} onProgress - Жүктеу барысын бақылау үшін функция
 * @returns {Promise<object>} - API жауабы
 */
const uploadFile = async (url, formData, onProgress) => {
  try {
    const authHeaders = authService.getAuthHeader();
    
    const response = await apiClient.post(url, formData, {
      headers: {
        ...authHeaders,
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Файл жүктеу қатесі ${url}:`, error);
    throw error;
  }
};

// Экспорттар
const api = {
  get,
  post,
  put,
  delete: del,
  uploadFile
};

export default api;