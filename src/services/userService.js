// src/services/userService.js
import crudService from './crudService';

/**
 * Пайдаланушылармен жұмыс істеуге арналған қызмет
 * 
 * @description Бұл сервис пайдаланушыларды басқару үшін CRUD және басқа операцияларды қамтамасыз етеді
 */
const userService = {
  /**
   * Пайдаланушылар тізімін алу (тек әкімші/кітапханашы)
   * 
   * @param {Object} params - Сұраныс параметрлері
   * @param {number} params.page - Бет нөмірі
   * @param {number} params.limit - Бір беттегі пайдаланушылар саны
   * @param {string} params.search - Іздеу сұранысы
   * @param {string} params.role - Рөл бойынша фильтр
   * @returns {Promise<Object>} Пайдаланушылар тізімі мен метаданнылар
   */
  getUsers: async (params = {}) => {
    return crudService.getAll('/users', params);
  },

  /**
   * Пайдаланушыны ID бойынша алу
   * 
   * @param {string|number} id - Пайдаланушы ID-сі
   * @returns {Promise<Object>} Пайдаланушы мәліметтері
   */
  getUser: async (id) => {
    return crudService.getById('/users', id);
  },

  /**
   * Ағымдағы пайдаланушы мәліметтерін алу
   * 
   * @returns {Promise<Object>} Пайдаланушы мәліметтері
   */
  getMe: async () => {
    return crudService.executeAction('/users/me', {}, 'get');
  },

  /**
   * Пайдаланушы мәліметтерін жаңарту
   * 
   * @param {Object} userData - Жаңартылған пайдаланушы мәліметтері
   * @returns {Promise<Object>} Жаңартылған пайдаланушы мәліметтері
   */
  updateMe: async (userData) => {
    return crudService.executeAction('/users/me', userData, 'put');
  },

  /**
   * Жаңа пайдаланушы жасау
   * 
   * @param {Object} userData - Пайдаланушы мәліметтері
   * @returns {Promise<Object>} Жаңа пайдаланушы мәліметтері
   */
  createUser: async (userData) => {
    return crudService.create('/users', userData);
  },

  /**
   * Пайдаланушыны жаңарту
   * 
   * @param {string|number} id - Пайдаланушы ID-сі
   * @param {Object} userData - Жаңартылған пайдаланушы мәліметтері
   * @returns {Promise<Object>} Жаңартылған пайдаланушы мәліметтері
   */
  updateUser: async (id, userData) => {
    return crudService.update('/users', id, userData);
  },

  /**
   * Пайдаланушыны жою
   * 
   * @param {string|number} id - Пайдаланушы ID-сі
   * @returns {Promise<Object>} Жою нәтижесі
   */
  deleteUser: async (id) => {
    return crudService.delete('/users', id);
  },

  /**
   * Аватар жүктеу
   * 
   * @param {File} file - Аватар файлы
   * @returns {Promise<Object>} Аватар жүктеу нәтижесі
   */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return crudService.uploadFile('/users/me/avatar', formData);
  },

  /**
   * Құпия сөзді өзгерту
   * 
   * @param {Object} passwordData - Құпия сөз мәліметтері
   * @param {string} passwordData.currentPassword - Ағымдағы құпия сөз
   * @param {string} passwordData.newPassword - Жаңа құпия сөз
   * @returns {Promise<Object>} Құпия сөз өзгерту нәтижесі
   */
  changePassword: async (passwordData) => {
    return crudService.executeAction('/users/me/password', passwordData, 'put');
  },

  /**
   * Пайдаланушы статистикасын алу
   * 
   * @returns {Promise<Object>} Пайдаланушы статистикасы
   */
  getMyStats: async () => {
    return crudService.executeAction('/users/me/stats', {}, 'get');
  },

  /**
   * Админ пайдаланушысын тіркеу (тек супер админ)
   * 
   * @param {Object} adminData - Админ мәліметтері
   * @returns {Promise<Object>} Жаңа админ мәліметтері
   */
  registerAdmin: async (adminData) => {
    return crudService.executeAction('/auth/register-admin', adminData, 'post');
  }
};

export default userService;