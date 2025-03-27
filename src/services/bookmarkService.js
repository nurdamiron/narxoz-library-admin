/**
 * Бетбелгілермен жұмыс істеуге арналған сервис
 * 
 * @description Бұл сервис пайдаланушының бетбелгілерін басқару үшін API функцияларын қамтиды
 */
import api from './api';

/**
 * Пайдаланушының барлық бетбелгілерін алу
 * 
 * @returns {Promise<Object>} - Бетбелгілер тізімі
 */
const getBookmarks = async () => {
  try {
    const response = await api.get('/bookmarks');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Жаңа бетбелгі қосу
 * 
 * @param {number} bookId - Кітап идентификаторы
 * @returns {Promise<Object>} - Жаңа бетбелгі мәліметтері
 */
const addBookmark = async (bookId) => {
  try {
    const response = await api.post('/bookmarks', { bookId });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Бетбелгіні жою
 * 
 * @param {number} id - Бетбелгі идентификаторы
 * @returns {Promise<Object>} - Жауап нәтижесі
 */
const deleteBookmark = async (id) => {
  try {
    const response = await api.delete(`/bookmarks/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Кітап ID бойынша бетбелгіні жою
 * 
 * @param {number} bookId - Кітап идентификаторы
 * @returns {Promise<Object>} - Жауап нәтижесі
 */
const deleteBookmarkByBookId = async (bookId) => {
  try {
    const response = await api.delete(`/bookmarks/book/${bookId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Бетбелгіні ауыстыру (қосу немесе жою)
 * 
 * @param {number} bookId - Кітап идентификаторы
 * @returns {Promise<Object>} - Бетбелгі жағдайы туралы ақпарат
 */
const toggleBookmark = async (bookId) => {
  try {
    const response = await api.post(`/bookmarks/toggle/${bookId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Кітаптың пайдаланушы үшін бетбелгіде бар-жоғын тексеру
 * 
 * @param {number} bookId - Кітап идентификаторы
 * @returns {Promise<Object>} - Бетбелгі туралы ақпарат
 */
const checkBookmark = async (bookId) => {
  try {
    const response = await api.get(`/bookmarks/check/${bookId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Барлық бетбелгілерді алу (тек әкімші/кітапханашы)
 * 
 * @param {Object} params - Сұраныс параметрлері
 * @param {number} [params.page=1] - Бет нөмірі
 * @param {number} [params.limit=25] - Бір беттегі бетбелгілер саны
 * @param {number} [params.userId] - Пайдаланушы ID бойынша сүзу
 * @param {number} [params.bookId] - Кітап ID бойынша сүзу
 * @returns {Promise<Object>} - Бетбелгілер тізімі мен пагинация
 */
const getAllBookmarks = async (params = {}) => {
  try {
    const response = await api.get('/bookmarks/all', params);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Ең көп бетбелгіге қосылған кітаптарды алу
 * 
 * @param {number} [limit=5] - Кітаптар саны
 * @returns {Promise<Object>} - Танымал кітаптар тізімі
 */
const getTrendingBooks = async (limit = 5) => {
  try {
    const response = await api.get('/bookmarks/trending', { limit });
    return response;
  } catch (error) {
    throw error;
  }
};

// Экспорттар
const bookmarkService = {
  getBookmarks,
  addBookmark,
  deleteBookmark,
  deleteBookmarkByBookId,
  toggleBookmark,
  checkBookmark,
  getAllBookmarks,
  getTrendingBooks
};

export default bookmarkService;