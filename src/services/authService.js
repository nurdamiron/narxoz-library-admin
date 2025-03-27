/**
 * Аутентификация сервисі
 * 
 * @description Бұл файл пайдаланушы аутентификациясы мен авторизациясы үшін 
 * функцияларды қамтиды. Ол базалық HTTP аутентификациясын қолданады.
 */
import axios from 'axios';

// API базовый URL и константы для localStorage
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const STORAGE_KEYS = {
  AUTH_USERNAME: 'auth_username',
  AUTH_PASSWORD: 'auth_password',
  AUTH_USER: 'auth_user',
  IS_AUTHENTICATED: 'isAuthenticated'
};

/**
 * Базалық аутентификация хедерін жасау
 * 
 * @param {string} username - Пайдаланушы аты (email)
 * @param {string} password - Құпия сөз
 * @returns {string} - Базалық аутентификация хедері
 */
const createBasicAuthHeader = (username, password) => {
  if (!username || !password) {
    console.error('Missing username or password for Basic Auth');
    return null;
  }
  return 'Basic ' + btoa(username + ':' + password);
};

/**
 * Пайдаланушының аутентификация мәліметтерін сақтау
 * 
 * @param {string} username - Пайдаланушы аты (email)
 * @param {string} password - Құпия сөз
 * @param {object} userData - Пайдаланушы туралы қосымша ақпарат
 */
const saveUserCredentials = (username, password, userData) => {
    try {
      // Проверка наличия необходимых данных
      if (!username || !password || !userData) {
        console.error('Missing data for saving credentials');
        return;
      }
  
      // Убедиться, что userData - объект
      const userObj = typeof userData === 'string' ? JSON.parse(userData) : userData;
      
      // Явное логирование данных перед сохранением
      console.log('Saving user credentials for:', username);
      console.log('User data to save:', JSON.stringify(userObj));
      
      // Ensure the user object has a role property
      if (!userObj.role) {
        console.warn('User data does not have a role, defaulting to "user"');
        userObj.role = 'user';
        
        // Special case for admin email
        if (username === 'admin@narxoz.kz') {
          console.log('Setting admin role for admin@narxoz.kz');
          userObj.role = 'admin';
        }
      }
      
      // Тек локальдық әзірлеу үшін - өндірістік ортада құпия сөзді сақтау ұсынылмайды
      localStorage.setItem(STORAGE_KEYS.AUTH_USERNAME, username);
      localStorage.setItem(STORAGE_KEYS.AUTH_PASSWORD, password);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userObj));
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
      
      console.log('User credentials saved successfully');
      
      // Проверка сохраненных данных
      const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      console.log('Stored user data:', storedUser);
    } catch (error) {
      console.error('Error saving user credentials:', error);
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
    console.log('User credentials cleared successfully');
  } catch (error) {
    console.error('Error clearing user credentials:', error);
  }
};

/**
 * Базалық аутентификация хедерін алу
 * 
 * @returns {object|null} - Хедер объектісі немесе null (егер мәліметтер сақталмаған болса)
 */
const getAuthHeader = () => {
  try {
    const username = localStorage.getItem('auth_username');
    const password = localStorage.getItem('auth_password');
    if (username && password) {
      return {
        'Authorization': createBasicAuthHeader(username, password)
      };
    } else {
      console.warn('No stored credentials found for auth header');
      return null;
    }
  } catch (error) {
    console.error('Error getting auth header:', error);
    return null;
  }
};

/**
 * Жүйеге кіру
 * 
 * @param {string} email - Пайдаланушы email-і
 * @param {string} password - Құпия сөз
 * @returns {Promise<object>} - Пайдаланушы мәліметтері
 */
const login = async (email, password) => {
    try {
      console.log('Attempting login for user:', email);
      // Проверка аргументов
      if (!email || !password) {
        throw new Error('Email және құпия сөзді енгізіңіз');
      }
  
      // Базовая авторизация в заголовке и данные в теле запроса
      const basicAuthHeader = createBasicAuthHeader(email, password);
      if (!basicAuthHeader) {
        throw new Error('Аутентификация мәліметтері жарамсыз');
      }
      
      // Special case for admin@narxoz.kz - bypass API for development/testing
      if (email === 'admin@narxoz.kz') {
        console.log('Admin login detected - using direct authentication');
        const adminUser = {
          id: 1,
          email: email,
          name: 'Әкімші',
          role: 'admin'
        };
        
        saveUserCredentials(email, password, adminUser);
        return adminUser;
      }
  
      // Отправка запроса на login
      const response = await axios({
        method: 'post',
        url: `${API_URL}/auth/login`,
        headers: {
          'Authorization': basicAuthHeader,
          'Content-Type': 'application/json'
        },
        data: {
          email: email,
          password: password
        }
      });
  
      console.log('Login response status:', response.status);
      console.log('Login response data:', response.data);
  
      // Проверка структуры ответа сервера
      let userData;
      
      if (response.data && response.data.success) {
        // Стандартная структура ответа API
        userData = response.data.data;
      } else if (response.data && response.data.Users && Array.isArray(response.data.Users)) {
        // Проверка альтернативной структуры: массив Users
        userData = response.data.Users.find(user => user.email === email);
      } else if (response.data && typeof response.data === 'object') {
        // Проверить, не является ли ответ напрямую объектом пользователя
        if (response.data.email === email) {
          userData = response.data;
        }
      }
      
      if (!userData) {
        console.error('Could not extract user data from response');
        throw new Error('Не удалось получить данные пользователя от сервера');
      }
      
      // Убедиться, что у пользователя есть роль
      if (!userData.role) {
        console.warn('User data does not contain role, setting default role "user"');
        userData.role = 'user';
      }
      
      // Явное логирование роли пользователя
      console.log('User role from API:', userData.role);
      
      // Сохранение учетных данных
      saveUserCredentials(email, password, userData);
      console.log('Login successful for user:', email);
      
      // Еще раз проверить, что данные сохранились корректно
      const storedUser = getCurrentUser();
      console.log('Stored user after login:', storedUser);
      console.log('Stored user role:', storedUser?.role);
      
      return userData;
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Более детальная информация об ошибке
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
        if (error.response.status === 401) {
          throw new Error('Қате email немесе құпия сөз');
        }
      }
      
      throw error;
    }
  };
  

/**
 * Жүйеден шығу
 */
const logout = () => {
  clearUserCredentials();
  window.location.href = '/login';
};

/**
 * Пайдаланушы аутентификациядан өтті ме
 * 
 * @returns {boolean} - Пайдаланушы аутентификациядан өткен бе
 */
const isAuthenticated = () => {
  try {
    const status = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
    const hasCredentials = 
      !!localStorage.getItem(STORAGE_KEYS.AUTH_USERNAME) && 
      !!localStorage.getItem(STORAGE_KEYS.AUTH_PASSWORD);
    
    // Проверка и валидация учетных данных
    if (status && !hasCredentials) {
      console.warn('Inconsistent auth state: authenticated but no credentials');
      clearUserCredentials(); // Очистка при несогласованности
      return false;
    }
    
    return status && hasCredentials;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

/**
 * Ағымдағы пайдаланушы мәліметтерін алу
 * 
 * @returns {object|null} - Пайдаланушы мәліметтері немесе null
 */
const getCurrentUser = () => {
    try {
      const userJson = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      console.log('Raw stored user data:', userJson);
      
      if (!userJson) {
        console.warn('No user data found in localStorage');
        return null;
      }
      
      try {
        const userData = JSON.parse(userJson);
        console.log('Parsed user data:', userData);
        
        // If no role is found, set a default role
        if (!userData.role) {
          console.warn('User data does not contain role, setting default role');
          const username = localStorage.getItem(STORAGE_KEYS.AUTH_USERNAME);
          
          if (username === 'admin@narxoz.kz') {
            userData.role = 'admin';
          } else {
            userData.role = 'user';
          }
          
          // Update storage with role
          localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
        }
        
        return userData;
      } catch (parseError) {
        console.error('Failed to parse user data:', parseError);
        // Fall back to manual role assignment
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
      console.error('Error getting current user:', error);
      return null;
    }
  };

/**
 * Пайдаланушы мәліметтерін жаңарту
 * 
 * @param {object} userData - Жаңа пайдаланушы мәліметтері
 */
const updateUserData = (userData) => {
  if (isAuthenticated() && userData) {
    try {
      // Ensure role exists
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
      console.error('Error updating user data:', error);
    }
  }
};

/**
 * Проверка правильности сохраненных учетных данных
 * 
 * @returns {Promise<boolean>} - Результат валидации
 */
const validateStoredCredentials = async () => {
  try {
    if (!isAuthenticated()) {
      return false;
    }
    
    const username = localStorage.getItem(STORAGE_KEYS.AUTH_USERNAME);
    const password = localStorage.getItem(STORAGE_KEYS.AUTH_PASSWORD);
    
    if (!username || !password) {
      return false;
    }
    
    // Special case for admin
    if (username === 'admin@narxoz.kz') {
      return true;
    }
    
    // Пробный запрос для проверки валидности учетных данных
    const response = await axios({
      method: 'get',
      url: `${API_URL}/auth/me`,
      headers: {
        'Authorization': createBasicAuthHeader(username, password)
      }
    });
    
    return response.status === 200 && response.data && response.data.success;
  } catch (error) {
    console.error('Error validating stored credentials:', error);
    return false;
  }
};

/**
 * Функция для принудительного обновления данных о пользователе в localStorage
 * 
 * @param {string} username - Email пользователя
 * @returns {boolean} - Успешно ли обновление данных
 */
const refreshAuthState = () => {
  try {
    const username = localStorage.getItem(STORAGE_KEYS.AUTH_USERNAME);
    const password = localStorage.getItem(STORAGE_KEYS.AUTH_PASSWORD);
    
    if (!username || !password) {
      console.error('Missing credentials in localStorage');
      return false;
    }
    
    // Явно установим роль админа, если это admin@narxoz.kz
    if (username === 'admin@narxoz.kz') {
      const adminData = {
        email: username,
        role: 'admin',
        name: 'Әкімші'
      };
      
      console.log('Setting admin data manually:', adminData);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(adminData));
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
    }
    
    // Проверим состояние после обновления
    const userJson = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    console.log('Updated user data:', userJson);
    return true;
  } catch (error) {
    console.error('Error refreshing auth state:', error);
    return false;
  }
};

// Экспорттар
const authService = {
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  updateUserData,
  getAuthHeader,
  validateStoredCredentials,
  refreshAuthState
};

export default authService;