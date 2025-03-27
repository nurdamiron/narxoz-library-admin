// src/services/crudService.js
import axios from 'axios';

/**
 * Барлық обьектілер үшін CRUD операцияларын қамтамасыз ететін қызмет
 * 
 * @description Бұл сервис барлық обьектілер (кітаптар, пайдаланушылар, 
 * категориялар, т.б.) үшін CRUD (Жасау, Оқу, Жаңарту, Жою) операцияларын 
 * стандартталған түрде қамтамасыз етеді.
 */

// API базалық URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Аутентификация хедерін алу
 * @returns {Object|null} Аутентификация хедері немесе null
 */
const getAuthHeader = () => {
  // localStorage-дан аутентификация мәліметтерін алу
  const username = localStorage.getItem('auth_username');
  const password = localStorage.getItem('auth_password');
  
  // Егер localStorage-да мәліметтер болмаса, әдепкі мәндерді қолдану (демо үшін)
  const usernameToUse = username;
  const passwordToUse = password;
  
  // Журналға хедерлерді жазу (отладка үшін)
  console.log('Creating auth header for', usernameToUse);
  
  // Базалық аутентификация хедері
  const headers = {
    'Authorization': 'Basic ' + btoa(`${usernameToUse}:${passwordToUse}`)
  };
  
  // admin@narxoz.kz үшін арнайы жағдай - рөлді тікелей қосу
  if (usernameToUse === 'admin@narxoz.kz') {
    headers['X-User-Role'] = 'admin';
  }
  
  return headers;
};

/**
 * Универсалды CRUD қызметі
 */
const crudService = {
  /**
   * Обьектілер тізімін алу
   * 
   * @param {string} endpoint - API endpoint (мысалы: '/books', '/users')
   * @param {Object} params - Сұраныс параметрлері (пагинация, фильтрация)
   * @returns {Promise<Object>} Обьектілер тізімі мен сұраныс метаданнылары (пагинация)
   */
  getAll: async (endpoint, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`, { 
        params,
        headers: getAuthHeader()
      });
      
      if (response.data && response.data.success) {
        return response.data;
      }
      
      return {
        success: false,
        data: [],
        total: 0,
        message: 'Деректерді жүктеу кезінде қате орын алды'
      };
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      
      // Егер авторизация қатесі болса
      if (error.response && error.response.status === 401) {
        return {
          success: false,
          data: [],
          total: 0,
          message: 'Аутентификация мерзімі аяқталды. Қайта кіріңіз.'
        };
      }
      
      throw error;
    }
  },
  
  /**
   * Жеке обьектті ID бойынша алу
   * 
   * @param {string} endpoint - API endpoint (мысалы: '/books', '/users')
   * @param {string|number} id - Обьект идентификаторы
   * @returns {Promise<Object>} Обьект мәліметтері
   */
  getById: async (endpoint, id) => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}/${id}`, {
        headers: getAuthHeader()
      });
      
      if (response.data && response.data.success) {
        return response.data;
      }
      
      return {
        success: false,
        data: null,
        message: 'Деректерді жүктеу кезінде қате орын алды'
      };
    } catch (error) {
      console.error(`Error fetching item with ID ${id} from ${endpoint}:`, error);
      throw error;
    }
  },
  
  /**
   * Жаңа обьект жасау
   * 
   * @param {string} endpoint - API endpoint (мысалы: '/books', '/users')
   * @param {Object} data - Жаңа обьект мәліметтері
   * @returns {Promise<Object>} Жаңа жасалған обьект мәліметтері
   */
  create: async (endpoint, data) => {
    try {
      // Аутентификация хедерлерін алу
      const authHeaders = getAuthHeader() || {};
      
      // admin@narxoz.kz үшін арнайы жағдай - рөлді тікелей қосу
      const username = localStorage.getItem('auth_username');
      if (username === 'admin@narxoz.kz') {
        authHeaders['X-User-Role'] = 'admin';
      }
      
      // Сұраныс мәліметтерін журналға жазу
      console.log('Creating item at', endpoint, 'with data:', data);
      console.log('Using headers:', authHeaders);
      
      // Сервер API-не сұраныс жіберу
      const response = await axios.post(`${API_URL}${endpoint}`, data, {
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        },
        withCredentials: true // Куки мен сессияны жіберу
      });
      
      // Сервер жауабын тексеру
      if (response.data && response.data.success) {
        return response.data;
      }
      
      return {
        success: false,
        data: null,
        message: 'Деректерді жасау кезінде қате орын алды'
      };
    } catch (error) {
      console.error(`Error creating item at ${endpoint}:`, error);
      
      // Нақты қате туралы ақпарат берейік
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
      }
      
      throw error;
    }
  },
  
  /**
   * Обьекті жаңарту
   * 
   * @param {string} endpoint - API endpoint (мысалы: '/books', '/users')
   * @param {string|number} id - Обьект идентификаторы
   * @param {Object} data - Жаңартылған обьект мәліметтері
   * @returns {Promise<Object>} Жаңартылған обьект мәліметтері
   */
  update: async (endpoint, id, data) => {
    try {
      const response = await axios.put(`${API_URL}${endpoint}/${id}`, data, {
        headers: getAuthHeader()
      });
      
      if (response.data && response.data.success) {
        return response.data;
      }
      
      return {
        success: false,
        data: null,
        message: 'Деректерді жаңарту кезінде қате орын алды'
      };
    } catch (error) {
      console.error(`Error updating item with ID ${id} at ${endpoint}:`, error);
      throw error;
    }
  },
  
  /**
   * Обьекті жою
   * 
   * @param {string} endpoint - API endpoint (мысалы: '/books', '/users')
   * @param {string|number} id - Обьект идентификаторы
   * @returns {Promise<Object>} Жою туралы ақпарат
   */
  delete: async (endpoint, id) => {
    try {
      const response = await axios.delete(`${API_URL}${endpoint}/${id}`, {
        headers: getAuthHeader()
      });
      
      if (response.data && response.data.success) {
        return response.data;
      }
      
      return {
        success: false,
        message: 'Деректерді жою кезінде қате орын алды'
      };
    } catch (error) {
      console.error(`Error deleting item with ID ${id} from ${endpoint}:`, error);
      throw error;
    }
  },
  
  /**
   * Арнайы әрекетті орындау
   * 
   * @param {string} endpoint - API endpoint (мысалы: '/books/return', '/users/activate')
   * @param {Object} data - Сұраныс мәліметтері
   * @param {string} method - HTTP метод (get, post, put)
   * @returns {Promise<Object>} Сұраныс нәтижесі
   */
  executeAction: async (endpoint, data = {}, method = 'post') => {
    try {
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await axios.get(`${API_URL}${endpoint}`, {
            params: data,
            headers: getAuthHeader()
          });
          break;
        case 'post':
          response = await axios.post(`${API_URL}${endpoint}`, data, {
            headers: getAuthHeader()
          });
          break;
        case 'put':
          response = await axios.put(`${API_URL}${endpoint}`, data, {
            headers: getAuthHeader()
          });
          break;
        default:
          throw new Error(`Қолданылмайтын HTTP метод: ${method}`);
      }
      
      if (response.data && response.data.success) {
        return response.data;
      }
      
      return {
        success: false,
        data: null,
        message: 'Әрекетті орындау кезінде қате орын алды'
      };
    } catch (error) {
      console.error(`Error executing action at ${endpoint}:`, error);
      throw error;
    }
  },
  
  /**
   * Файлды жүктеу
   * 
   * @param {string} endpoint - API endpoint (мысалы: '/books/{id}/cover', '/users/avatar')
   * @param {FormData} formData - Жүктелетін файл(дар)
   * @param {Function} [onProgress] - Прогресс туралы хабарлау үшін колбэк
   * @returns {Promise<Object>} Жүктеу нәтижесі
   */
  uploadFile: async (endpoint, formData, onProgress) => {
    try {
      const headers = {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      };
      
      const response = await axios.post(`${API_URL}${endpoint}`, formData, {
        headers,
        onUploadProgress: onProgress ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        } : undefined
      });
      
      if (response.data && response.data.success) {
        return response.data;
      }
      
      return {
        success: false,
        data: null,
        message: 'Файлды жүктеу кезінде қате орын алды'
      };
    } catch (error) {
      console.error(`Error uploading file to ${endpoint}:`, error);
      throw error;
    }
  }
};

export default crudService;