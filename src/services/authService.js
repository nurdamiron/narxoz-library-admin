/**
 * Аутентификация сервисі
 * 
 * @description Бұл файл пайдаланушы аутентификациясы мен авторизациясы үшін 
 * функцияларды қамтиды. Ол базалық HTTP аутентификациясын қолданады.
 */
import axios from 'axios';
import { API_URL } from '../config/constants';

/**
 * Базалық аутентификация хедерін жасау
 * 
 * @param {string} username - Пайдаланушы аты (email)
 * @param {string} password - Құпия сөз
 * @returns {string} - Базалық аутентификация хедері
 */
const createBasicAuthHeader = (username, password) => {
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
  // Тек локальдық әзірлеу үшін - өндірістік ортада құпия сөзді сақтау ұсынылмайды
  localStorage.setItem('auth_username', username);
  localStorage.setItem('auth_password', password);
  localStorage.setItem('auth_user', JSON.stringify(userData));
  localStorage.setItem('isAuthenticated', 'true');
};

/**
 * Пайдаланушының аутентификация мәліметтерін жою
 */
const clearUserCredentials = () => {
  localStorage.removeItem('auth_username');
  localStorage.removeItem('auth_password');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('isAuthenticated');
};

/**
 * Базалық аутентификация хедерін алу
 * 
 * @returns {object|null} - Хедер объектісі немесе null (егер мәліметтер сақталмаған болса)
 */
const getAuthHeader = () => {
  const username = localStorage.getItem('auth_username');
  const password = localStorage.getItem('auth_password');

  if (username && password) {
    return {
      'Authorization': createBasicAuthHeader(username, password)
    };
  }
  return null;
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
    // Теперь отправляем и в теле и в заголовке, так как бэкенд ожидает email и пароль в теле запроса
    const response = await axios({
      method: 'post',
      url: `${API_URL}/auth/login`,
      headers: {
        'Authorization': createBasicAuthHeader(email, password),
        'Content-Type': 'application/json'
      },
      data: {
        email: email,
        password: password
      }
    });

    if (response.data && response.data.success) {
      saveUserCredentials(email, password, response.data.data);
      return response.data.data;
    } else {
      throw new Error('Жауап деректері жарамсыз');
    }
  } catch (error) {
    console.error('Кіру қатесі:', error);
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
  return localStorage.getItem('isAuthenticated') === 'true';
};

/**
 * Ағымдағы пайдаланушы мәліметтерін алу
 * 
 * @returns {object|null} - Пайдаланушы мәліметтері немесе null
 */
const getCurrentUser = () => {
  const userJson = localStorage.getItem('auth_user');
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Пайдаланушы мәліметтерін жаңарту
 * 
 * @param {object} userData - Жаңа пайдаланушы мәліметтері
 */
const updateUserData = (userData) => {
  if (isAuthenticated()) {
    localStorage.setItem('auth_user', JSON.stringify(userData));
  }
};

/**
 * Әкімші тіркеу (тек басқа әкімшілер үшін)
 * 
 * @param {object} adminData - Жаңа әкімші мәліметтері
 * @returns {Promise<object>} - Жаңа әкімші мәліметтері
 */
const registerAdmin = async (adminData) => {
  try {
    const headers = getAuthHeader();
    if (!headers) {
      throw new Error('Аутентификация қажет');
    }

    const response = await axios.post(`${API_URL}/auth/register-admin`, adminData, {
      headers
    });

    return response.data.data;
  } catch (error) {
    console.error('Әкімші тіркеу қатесі:', error);
    throw error;
  }
};

/**
 * Пайдаланушы мәліметтерін жаңарту
 * 
 * @param {object} userData - Жаңартылған пайдаланушы мәліметтері
 * @returns {Promise<object>} - Жаңартылған пайдаланушы мәліметтері
 */
const updateUserDetails = async (userData) => {
  try {
    const headers = getAuthHeader();
    if (!headers) {
      throw new Error('Аутентификация қажет');
    }

    const response = await axios.put(`${API_URL}/auth/updatedetails`, userData, {
      headers
    });

    // Жергілікті сақталған пайдаланушы мәліметтерін жаңарту
    updateUserData(response.data.data);
    
    return response.data.data;
  } catch (error) {
    console.error('Пайдаланушы мәліметтерін жаңарту қатесі:', error);
    throw error;
  }
};

/**
 * Құпия сөзді өзгерту
 * 
 * @param {string} currentPassword - Ағымдағы құпия сөз
 * @param {string} newPassword - Жаңа құпия сөз
 * @returns {Promise<object>} - Жауап мәліметтері
 */
const updatePassword = async (currentPassword, newPassword) => {
  try {
    const headers = getAuthHeader();
    if (!headers) {
      throw new Error('Аутентификация қажет');
    }

    const response = await axios.put(`${API_URL}/auth/updatepassword`, 
      { currentPassword, newPassword },
      { headers }
    );

    // Құпия сөз өзгертілгеннен кейін аутентификация мәліметтерін жаңарту
    if (response.data && response.data.success) {
      const username = localStorage.getItem('auth_username');
      if (username) {
        saveUserCredentials(username, newPassword, getCurrentUser());
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Құпия сөзді жаңарту қатесі:', error);
    throw error;
  }
};

/**
 * Email бар-жоғын тексеру
 * 
 * @param {string} email - Тексерілетін email
 * @returns {Promise<boolean>} - Email бар-жоғы туралы ақпарат
 */
const checkEmailExists = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/check-email`, { email });
    return response.data.exists;
  } catch (error) {
    console.error('Email тексеру қатесі:', error);
    throw error;
  }
};

// Экспорттар
const authService = {
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  registerAdmin,
  updateUserDetails,
  updatePassword,
  checkEmailExists,
  getAuthHeader
};

export default authService;