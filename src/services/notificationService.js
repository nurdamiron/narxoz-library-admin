/**
 * Хабарландырулармен жұмыс істеуге арналған сервис
 * 
 * @description Бұл сервис пайдаланушы хабарландыруларын басқару үшін API функцияларын қамтиды
 */
import api from './api';

/**
 * Пайдаланушы хабарландыруларын алу
 * 
 * @param {Object} params - Сұраныс параметрлері
 * @param {number} [params.page=1] - Бет нөмірі
 * @param {number} [params.limit=10] - Бір беттегі хабарландырулар саны
 * @param {boolean} [params.read] - Оқылған/оқылмаған хабарландыруларды сүзу
 * @param {string} [params.type] - Хабарландыру түрі бойынша сүзу
 * @returns {Promise<Object>} - Хабарландырулар тізімі мен пагинация
 */
const getNotifications = async (params = {}) => {
  try {
    const response = await api.get('/notifications', params);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Жеке хабарландыруды алу
 * 
 * @param {number} id - Хабарландыру идентификаторы
 * @returns {Promise<Object>} - Хабарландыру мәліметтері
 */
const getNotification = async (id) => {
  try {
    const response = await api.get(`/notifications/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Хабарландыруды оқылды деп белгілеу
 * 
 * @param {number} id - Хабарландыру идентификаторы
 * @returns {Promise<Object>} - Жаңартылған хабарландыру мәліметтері
 */
const markAsRead = async (id) => {
  try {
    const response = await api.put(`/notifications/${id}/read`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Хабарландыруды жою
 * 
 * @param {number} id - Хабарландыру идентификаторы
 * @returns {Promise<Object>} - Жауап нәтижесі
 */
const deleteNotification = async (id) => {
  try {
    const response = await api.delete(`/notifications/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Барлық хабарландыруларды оқылды деп белгілеу
 * 
 * @returns {Promise<Object>} - Жауап нәтижесі
 */
const markAllAsRead = async () => {
  try {
    const response = await api.put('/notifications/read-all');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Оқылмаған хабарландырулар санын алу
 * 
 * @returns {Promise<Object>} - Оқылмаған хабарландырулар саны
 */
const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Жаңа хабарландыру жасау (тек әкімші)
 * 
 * @param {Object} notificationData - Хабарландыру мәліметтері
 * @returns {Promise<Object>} - Жаңа хабарландыру мәліметтері
 */
const createNotification = async (notificationData) => {
  try {
    const response = await api.post('/notifications', notificationData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Барлық пайдаланушыларға хабарландыру жіберу (тек әкімші)
 * 
 * @param {Object} broadcastData - Жіберілетін хабарландыру мәліметтері
 * @param {string} broadcastData.title - Хабарландыру тақырыбы
 * @param {string} broadcastData.message - Хабарландыру мәтіні
 * @param {string} [broadcastData.type='system'] - Хабарландыру түрі
 * @param {string} [broadcastData.role] - Белгілі бір рөлдегі пайдаланушыларға ғана жіберу
 * @returns {Promise<Object>} - Жауап нәтижесі
 */
const broadcastNotification = async (broadcastData) => {
  try {
    const response = await api.post('/notifications/broadcast', broadcastData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Экспорттар
const notificationService = {
  getNotifications,
  getNotification,
  markAsRead,
  deleteNotification,
  markAllAsRead,
  getUnreadCount,
  createNotification,
  broadcastNotification
};

export default notificationService;