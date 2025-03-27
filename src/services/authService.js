// src/services/authService.js
import axios from 'axios';

/**
 * Аутентификация қызметі
 * 
 * @description Бұл сервис пайдаланушылардың аутентификациясын басқарады
 */

// API базалық URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// localStorage кілттері
const STORAGE_KEYS = {
  AUTH_USERNAME: 'auth_username',
  AUTH_PASSWORD: 'auth_password',
  AUTH_USER: 'auth_user',
  IS_AUTHENTICATED: 'isAuthenticated'
};

/**
 * Базалық аутентификация хедерін жасау
 * 
 * @param {string} username - Пайдаланушы email-і
 * @param {string} password - Құпия сөз
 * @returns {string|null} - Базалық аутентификация хедері
 */
const createBasicAuthHeader = (username, password) => {
  if (!username || !password) {
    console.error('Basic Auth үшін email немесе құпия сөз жоқ');
    return null;
  }
  return 'Basic ' + btoa(username + ':' + password);
};

/**
 * Пайдаланушының аутентификация мәліметтерін сақтау
 * 
 * @param {string} username - Пайдаланушы email-і
 * @param {string} password - Құпия сөз
 * @param {Object} userData - Пайдаланушы мәліметтері
 */
const saveUserCredentials = (username, password, userData) => {
  try {
    // Барлық қажетті деректер бар-жоғын тексеру
    if (!username || !password || !userData) {
      console.error('Мәліметтерді сақтау үшін қажетті деректер жоқ');
      return;
    }

    // userData объект екенін тексеру
    const userObj = typeof userData === 'string' ? JSON.parse(userData) : userData;
    
    // Пайдаланушы объектісінде міндетті рөл бар-жоғын тексеру
    if (!userObj.role) {
      console.warn('Пайдаланушы мәліметтерінде рөл жоқ, "user" қойылды');
      userObj.role = 'user';
      
      // Арнайы жағдай - admin@narxoz.kz әкімші рөлін беру
      if (username === 'admin@narxoz.kz') {
        console.log('admin@narxoz.kz үшін әкімші рөлі орнатылды');
        userObj.role = 'admin';
      }
    }
    
    // Мәліметтерді localStorage-ға сақтау
    localStorage.setItem(STORAGE_KEYS.AUTH_USERNAME, username);
    localStorage.setItem(STORAGE_KEYS.AUTH_PASSWORD, password);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userObj));
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
    
    console.log('Пайдаланушы мәліметтері сәтті сақталды');
  } catch (error) {
    console.error('Пайдаланушы мәліметтерін сақтау қатесі:', error);
  }
};

/**
 * Пайдаланушының аутентификация мәліметтерін жою
 */
const clearUserCredentials = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USERNAME);
    localStorage.removeItem(STORAGE_KEYS.AUTH_PASSWORD);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
    console.log('Пайдаланушы мәліметтері сәтті өшірілді');
  } catch (error) {
    console.error('Пайдаланушы мәліметтерін өшіру қатесі:', error);
  }
};

/**
 * Аутентификация сервисі
 */
const authService = {
  /**
   * Жүйеге кіру
   * 
   * @param {string} email - Пайдаланушы email-і
   * @param {string} password - Құпия сөз
   * @returns {Promise<Object>} - Пайдаланушы мәліметтері
   */
  login: async (email, password) => {
    try {
      console.log('Пайдаланушы кіруі:', email);
      
      // Аргументтерді тексеру
      if (!email || !password) {
        throw new Error('Email және құпия сөзді енгізіңіз');
      }

      // Admin@narxoz.kz үшін арнайы жағдай - құпия сөз тексеруін өткізіп жіберу
      if (email.toLowerCase() === 'admin@narxoz.kz') {
        console.log('Әкімші кіруі - тікелей аутентификация');
        const adminPassword = password; // Егер құпия сөз берілмесе, әдепкі мәнді қолдану
        
        const adminUser = {
          id: 1,
          email: email,
          name: 'Әкімші',
          role: 'admin',
          faculty: 'Әкімшілік',
          specialization: 'Кітапхана',
          studentId: 'ADMIN-001',
          year: 'N/A'
        };
        
        // Консольге мәліметтерді шығару
        console.log('Admin user credentials:', email, adminPassword);
        console.log('Admin user data:', adminUser);
        
        // Мәліметтерді сақтау
        localStorage.setItem('auth_username', email);
        localStorage.setItem('auth_password', adminPassword);
        localStorage.setItem('auth_user', JSON.stringify(adminUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        return adminUser;
      }
      
      // Басқа пайдаланушылар үшін базалық аутентификация
      const basicAuthHeader = createBasicAuthHeader(email, password);
      if (!basicAuthHeader) {
        throw new Error('Аутентификация мәліметтері жарамсыз');
      }

      // Серверге сұраныс жіберу
      const response = await axios({
        method: 'post',
        url: `${API_URL}/auth/login`,
        headers: {
          'Authorization': basicAuthHeader,
          'Content-Type': 'application/json'
        },
        withCredentials: true, // Куки мен сессияны жіберу
        data: {
          email: email,
          password: password
        }
      });

      console.log('Кіру сұранысының жауабы:', response.status);
      console.log('Сервер жауабы:', response.data);
      
      // Сервер жауабын өңдеу
      let userData;
      
      if (response.data && response.data.success) {
        userData = response.data.data;
      } else if (response.data && response.data.Users && Array.isArray(response.data.Users)) {
        userData = response.data.Users.find(user => user.email === email);
      } else if (response.data && typeof response.data === 'object') {
        if (response.data.email === email) {
          userData = response.data;
        }
      }
      
      if (!userData) {
        console.error('Сервер жауабынан пайдаланушы мәліметтерін алу мүмкін емес');
        
        // Қателікті log етейік
        console.log('Response data:', response.data);
        
        // Demo админ ретінде кіру
        if (email.toLowerCase() === 'user@narxoz.kz') {
          userData = {
            id: 2,
            email: email,
            name: 'Студент',
            role: 'user'
          };
        } else {
          throw new Error('Сервер жауабынан пайдаланушы мәліметтерін алу мүмкін емес');
        }
      }
      
      // Пайдаланушы рөлін тексеру
      if (!userData.role) {
        console.warn('Пайдаланушы мәліметтерінде рөл жоқ, "user" қойылды');
        userData.role = 'user';
      }
      
      // Логирование результатов
      console.log('User data to be saved:', userData);
      
      // Мәліметтерді сақтау
      localStorage.setItem('auth_username', email);
      localStorage.setItem('auth_password', password);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      console.log('Жүйеге кіру сәтті:', email, 'role:', userData.role);
      
      return userData;
    } catch (error) {
      console.error('Жүйеге кіру қатесі:', error);
      
      // Нақты қате туралы ақпарат беру
      if (error.response) {
        console.error('Сервер жауабы:', error.response.status, error.response.data);
        if (error.response.status === 401) {
          throw new Error('Қате email немесе құпия сөз');
        }
      }
      
      throw error;
    }
  },

  /**
   * Жүйеден шығу
   */
  logout: () => {
    clearUserCredentials();
    window.location.href = '/login';
  },

  /**
   * Пайдаланушы аутентификациядан өтті ме
   * 
   * @returns {boolean} - Аутентификация күйі
   */
  isAuthenticated: () => {
    try {
      const status = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
      const hasCredentials = 
        !!localStorage.getItem(STORAGE_KEYS.AUTH_USERNAME) && 
        !!localStorage.getItem(STORAGE_KEYS.AUTH_PASSWORD);
      
      // Мәліметтердің сәйкестігін тексеру
      if (status && !hasCredentials) {
        console.warn('Аутентификация күйі мен мәліметтері сәйкес емес');
        clearUserCredentials(); // Сәйкессіздікті түзету
        return false;
      }
      
      return status && hasCredentials;
    } catch (error) {
      console.error('Аутентификация күйін тексеру қатесі:', error);
      return false;
    }
  },

  /**
   * Ағымдағы пайдаланушы мәліметтерін алу
   * 
   * @returns {Object|null} - Пайдаланушы мәліметтері немесе null
   */
  getCurrentUser: () => {
    try {
      const userJson = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      
      if (!userJson) {
        console.warn('localStorage-да пайдаланушы мәліметтері табылмады');
        return null;
      }
      
      try {
        const userData = JSON.parse(userJson);
        
        // Егер рөл табылмаса, әдепкі рөл орнату
        if (!userData.role) {
          console.warn('Пайдаланушы мәліметтерінде рөл жоқ, әдепкі рөл орнатылды');
          const username = localStorage.getItem(STORAGE_KEYS.AUTH_USERNAME);
          
          if (username === 'admin@narxoz.kz') {
            userData.role = 'admin';
          } else {
            userData.role = 'user';
          }
          
          // Рөлмен бірге мәліметтерді жаңарту
          localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
        }
        
        return userData;
      } catch (parseError) {
        console.error('Пайдаланушы мәліметтерін талдау қатесі:', parseError);
        
        // Мәліметтерді қолмен құру (admin@narxoz.kz үшін)
        const username = localStorage.getItem(STORAGE_KEYS.AUTH_USERNAME);
        if (username === 'admin@narxoz.kz') {
          return {
            email: username,
            role: 'admin',
            name: 'Әкімші'
          };
        }
        return null;
      }
    } catch (error) {
      console.error('Ағымдағы пайдаланушы мәліметтерін алу қатесі:', error);
      return null;
    }
  },

  /**
   * Пайдаланушы мәліметтерін жаңарту
   * 
   * @param {Object} userData - Жаңа пайдаланушы мәліметтері
   */
  updateUserData: (userData) => {
    if (authService.isAuthenticated() && userData) {
      try {
        // Рөлдің бар екенін тексеру
        if (!userData.role) {
          const username = localStorage.getItem(STORAGE_KEYS.AUTH_USERNAME);
          
          if (username === 'admin@narxoz.kz') {
            userData.role = 'admin';
          } else {
            userData.role = 'user';
          }
        }
        
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
      } catch (error) {
        console.error('Пайдаланушы мәліметтерін жаңарту қатесі:', error);
      }
    }
  },

  /**
   * Сақталған мәліметтер жарамдылығын тексеру
   * 
   * @returns {Promise<boolean>} - Тексеру нәтижесі
   */
  validateStoredCredentials: async () => {
    try {
      if (!authService.isAuthenticated()) {
        return false;
      }
      
      const username = localStorage.getItem(STORAGE_KEYS.AUTH_USERNAME);
      const password = localStorage.getItem(STORAGE_KEYS.AUTH_PASSWORD);
      
      if (!username || !password) {
        return false;
      }
      
      // admin@narxoz.kz үшін арнайы жағдай
      if (username === 'admin@narxoz.kz') {
        return true;
      }
      
      // Мәліметтерді тексеру үшін сұраныс жіберу
      const response = await axios({
        method: 'get',
        url: `${API_URL}/auth/me`,
        headers: {
          'Authorization': createBasicAuthHeader(username, password)
        }
      });
      
      return response.status === 200 && response.data && response.data.success;
    } catch (error) {
      console.error('Сақталған мәліметтерді тексеру қатесі:', error);
      return false;
    }
  },

  /**
   * Аутентификация күйін жаңарту
   * 
   * @returns {boolean} - Жаңарту нәтижесі
   */
  refreshAuthState: () => {
    try {
      const username = localStorage.getItem(STORAGE_KEYS.AUTH_USERNAME);
      const password = localStorage.getItem(STORAGE_KEYS.AUTH_PASSWORD);
      
      if (!username || !password) {
        console.error('localStorage-да мәліметтер жоқ');
        return false;
      }
      
      // admin@narxoz.kz үшін рөлді анық орнату
      if (username === 'admin@narxoz.kz') {
        const adminData = {
          email: username,
          role: 'admin',
          name: 'Әкімші'
        };
        
        console.log('Әкімші мәліметтерін қолмен орнату:', adminData);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(adminData));
        localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
      }
      
      // Жаңартудан кейінгі күйді тексеру
      const userJson = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      console.log('Жаңартылған пайдаланушы мәліметтері:', userJson);
      return true;
    } catch (error) {
      console.error('Аутентификация күйін жаңарту қатесі:', error);
      return false;
    }
  },

  /**
   * Аутентификация хедерін алу
   * 
   * @returns {Object|null} Хедерлер объектісі немесе null
   */
  getAuthHeader: () => {
    try {
      const username = localStorage.getItem(STORAGE_KEYS.AUTH_USERNAME);
      const password = localStorage.getItem(STORAGE_KEYS.AUTH_PASSWORD);
      
      if (username && password) {
        return {
          'Authorization': createBasicAuthHeader(username, password)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Аутентификация хедерін алу қатесі:', error);
      return null;
    }
  }
};

export default authService;