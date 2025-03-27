/**
 * Пайдаланушылармен жұмыс істеуге арналған сервис
 * 
 * @description Бұл сервис пайдаланушыларды басқару үшін API функцияларын қамтиды
 */
import api from './api';

/**
 * Барлық пайдаланушыларды алу
 * 
 * @param {Object} params - Сұраныс параметрлері
 * @param {number} [params.page=1] - Бет нөмірі
 * @param {number} [params.limit=10] - Бір беттегі пайдаланушылар саны
 * @param {string} [params.search] - Іздеу сұранысы
 * @param {string} [params.role] - Пайдаланушы рөлі бойынша сүзу
 * @returns {Promise<Object>} - Пайдаланушылар тізімі мен пагинация
 */
const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/users', params);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Жеке пайдаланушыны алу
 * 
 * @param {number} id - Пайдаланушы идентификаторы
 * @returns {Promise<Object>} - Пайдаланушы мәліметтері
 */
const getUser = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Ағымдағы пайдаланушы профилін алу
 * 
 * @returns {Promise<Object>} - Ағымдағы пайдаланушы мәліметтері
 */
const getCurrentUserProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Жаңа пайдаланушы жасау
 * 
 * @param {Object} userData - Пайдаланушы мәліметтері
 * @returns {Promise<Object>} - Жаңа пайдаланушы мәліметтері
 */
const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Пайдаланушы мәліметтерін жаңарту
 * 
 * @param {number} id - Пайдаланушы идентификаторы
 * @param {Object} userData - Жаңартылған пайдаланушы мәліметтері
 * @returns {Promise<Object>} - Жаңартылған пайдаланушы мәліметтері
 */
const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Жеке профильді жаңарту
 * 
 * @param {Object} userData - Жаңартылған пайдаланушы мәліметтері
 * @returns {Promise<Object>} - Жаңартылған пайдаланушы мәліметтері
 */
const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/me', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Пайдаланушыны жою
 * 
 * @param {number} id - Пайдаланушы идентификаторы
 * @returns {Promise<Object>} - Жауап нәтижесі
 */
const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Аватар жүктеу
 * 
 * @param {File} file - Жүктелетін файл
 * @param {Function} [onProgress] - Жүктеу барысы туралы хабарлау үшін функция
 * @returns {Promise<Object>} - Жүктелген аватар туралы ақпарат
 */
const uploadAvatar = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.uploadFile('/users/me/avatar', formData, onProgress);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Пайдаланушы статистикасын алу
 * 
 * @returns {Promise<Object>} - Пайдаланушы статистикасы
 */
const getUserStats = async () => {
  try {
    const response = await api.get('/users/me/stats');
    return response;
  } catch (error) {
    throw error;
  }
};

// Экспорттар
const userService = {
  getUsers,
  getUser,
  getCurrentUserProfile,
  createUser,
  updateUser,
  updateProfile,
  deleteUser,
  uploadAvatar,
  getUserStats
};

export default userService;