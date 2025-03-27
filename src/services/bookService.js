/**
 * Кітаптармен жұмыс істеуге арналған сервис
 * 
 * @description Бұл сервис кітаптарды басқару үшін API функцияларын қамтиды
 */
import api from './api';

/**
 * Барлық кітаптарды алу
 * 
 * @param {Object} params - Сұраныс параметрлері
 * @param {number} [params.page=1] - Бет нөмірі
 * @param {number} [params.limit=10] - Бір беттегі кітаптар саны
 * @param {string} [params.search] - Іздеу сұранысы
 * @param {string} [params.categoryId] - Категория бойынша сүзу
 * @param {string} [params.language] - Тіл бойынша сүзу
 * @param {string} [params.available] - Қолжетімділік бойынша сүзу
 * @returns {Promise<Object>} - Кітаптар тізімі мен пагинация
 */
const getBooks = async (params = {}) => {
  try {
    const response = await api.get('/books', params);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Жеке кітапты алу
 * 
 * @param {number} id - Кітап идентификаторы
 * @returns {Promise<Object>} - Кітап мәліметтері
 */
const getBook = async (id) => {
  try {
    const response = await api.get(`/books/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Танымал кітаптарды алу
 * 
 * @param {number} [limit=4] - Кітаптар саны
 * @returns {Promise<Object>} - Танымал кітаптар тізімі
 */
const getPopularBooks = async (limit = 4) => {
  try {
    const response = await api.get('/books/popular', { limit });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Жаңа кітаптарды алу
 * 
 * @param {number} [limit=4] - Кітаптар саны
 * @returns {Promise<Object>} - Жаңа кітаптар тізімі
 */
const getNewBooks = async (limit = 4) => {
  try {
    const response = await api.get('/books/new', { limit });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Жаңа кітап жасау
 * 
 * @param {Object} bookData - Кітап мәліметтері
 * @returns {Promise<Object>} - Жаңа кітап мәліметтері
 */
const createBook = async (bookData) => {
  try {
    const response = await api.post('/books', bookData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Кітап мәліметтерін жаңарту
 * 
 * @param {number} id - Кітап идентификаторы
 * @param {Object} bookData - Жаңартылған кітап мәліметтері
 * @returns {Promise<Object>} - Жаңартылған кітап мәліметтері
 */
const updateBook = async (id, bookData) => {
  try {
    const response = await api.put(`/books/${id}`, bookData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Кітапты жою
 * 
 * @param {number} id - Кітап идентификаторы
 * @returns {Promise<Object>} - Жауап нәтижесі
 */
const deleteBook = async (id) => {
  try {
    const response = await api.delete(`/books/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Кітап мұқабасын жүктеу
 * 
 * @param {number} id - Кітап идентификаторы
 * @param {File} file - Жүктелетін файл
 * @param {Function} [onProgress] - Жүктеу барысы туралы хабарлау үшін функция
 * @returns {Promise<Object>} - Жүктелген мұқаба туралы ақпарат
 */
const uploadBookCover = async (id, file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.uploadFile(`/books/${id}/cover`, formData, onProgress);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Кітап қорын жаңарту
 * 
 * @param {number} id - Кітап идентификаторы
 * @param {Object} inventoryData - Жаңартылған қор мәліметтері
 * @param {number} [inventoryData.totalCopies] - Жалпы даналар саны
 * @param {number} [inventoryData.availableCopies] - Қолжетімді даналар саны
 * @returns {Promise<Object>} - Жаңартылған кітап мәліметтері
 */
const updateInventory = async (id, inventoryData) => {
  try {
    const response = await api.put(`/books/${id}/inventory`, inventoryData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Барлық категорияларды алу
 * 
 * @returns {Promise<Object>} - Категориялар тізімі
 */
const getCategories = async () => {
  try {
    const response = await api.get('/books/categories');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Жаңа категория жасау
 * 
 * @param {Object} categoryData - Категория мәліметтері
 * @returns {Promise<Object>} - Жаңа категория мәліметтері
 */
const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/books/categories', categoryData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Категория мәліметтерін жаңарту
 * 
 * @param {number} id - Категория идентификаторы
 * @param {Object} categoryData - Жаңартылған категория мәліметтері
 * @returns {Promise<Object>} - Жаңартылған категория мәліметтері
 */
const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/books/categories/${id}`, categoryData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Категорияны жою
 * 
 * @param {number} id - Категория идентификаторы
 * @returns {Promise<Object>} - Жауап нәтижесі
 */
const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/books/categories/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Экспорттар
const bookService = {
  getBooks,
  getBook,
  getPopularBooks,
  getNewBooks,
  createBook,
  updateBook,
  deleteBook,
  uploadBookCover,
  updateInventory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

export default bookService;