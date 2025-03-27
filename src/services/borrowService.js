/**
 * Қарызға алулармен жұмыс істеуге арналған сервис
 * 
 * @description Бұл сервис кітаптарды қарызға алу операцияларын басқару үшін API функцияларын қамтиды
 */
import api from './api';

/**
 * Пайдаланушының барлық қарызға алуларын алу
 * 
 * @param {Object} params - Сұраныс параметрлері
 * @param {number} [params.page=1] - Бет нөмірі
 * @param {number} [params.limit=10] - Бір беттегі қарызға алулар саны
 * @param {string} [params.status] - Мәртебе бойынша сүзу
 * @returns {Promise<Object>} - Қарызға алулар тізімі мен пагинация
 */
const getUserBorrows = async (params = {}) => {
  try {
    const response = await api.get('/borrows', params);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Барлық қарызға алуларды алу (тек әкімші/кітапханашы)
 * 
 * @param {Object} params - Сұраныс параметрлері
 * @param {number} [params.page=1] - Бет нөмірі
 * @param {number} [params.limit=20] - Бір беттегі қарызға алулар саны
 * @param {string} [params.status] - Мәртебе бойынша сүзу
 * @param {number} [params.userId] - Пайдаланушы ID бойынша сүзу
 * @param {number} [params.bookId] - Кітап ID бойынша сүзу
 * @param {string} [params.startDate] - Бастапқы күні
 * @param {string} [params.endDate] - Соңғы күні
 * @param {boolean} [params.overdue] - Мерзімі өткен қарызға алуларды сүзу
 * @returns {Promise<Object>} - Қарызға алулар тізімі мен пагинация
 */
const getAllBorrows = async (params = {}) => {
  try {
    const response = await api.get('/borrows/all', params);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Жеке қарызға алуды алу
 * 
 * @param {number} id - Қарызға алу идентификаторы
 * @returns {Promise<Object>} - Қарызға алу мәліметтері
 */
const getBorrow = async (id) => {
  try {
    const response = await api.get(`/borrows/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Кітапты қарызға алу
 * 
 * @param {number} bookId - Кітап идентификаторы
 * @returns {Promise<Object>} - Жаңа қарызға алу мәліметтері
 */
const borrowBook = async (bookId) => {
  try {
    const response = await api.post('/borrows', { bookId });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Қарызға алынған кітапты қайтару
 * 
 * @param {number} id - Қарызға алу идентификаторы
 * @returns {Promise<Object>} - Жаңартылған қарызға алу мәліметтері
 */
const returnBook = async (id) => {
  try {
    const response = await api.put(`/borrows/${id}/return`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Қарызға алу мерзімін ұзарту
 * 
 * @param {number} id - Қарызға алу идентификаторы
 * @returns {Promise<Object>} - Жаңартылған қарызға алу мәліметтері
 */
const extendBorrow = async (id) => {
  try {
    const response = await api.put(`/borrows/${id}/extend`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Қарызға алу мәліметтерін жаңарту (тек әкімші/кітапханашы)
 * 
 * @param {number} id - Қарызға алу идентификаторы
 * @param {Object} borrowData - Жаңартылған қарызға алу мәліметтері
 * @param {string} [borrowData.status] - Қарызға алу мәртебесі
 * @param {string} [borrowData.dueDate] - Қайтару мерзімі
 * @param {string} [borrowData.notes] - Ескертпелер
 * @returns {Promise<Object>} - Жаңартылған қарызға алу мәліметтері
 */
const updateBorrow = async (id, borrowData) => {
  try {
    const response = await api.put(`/borrows/${id}`, borrowData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Мерзімі өткен қарызға алуларды тексеру
 * 
 * @returns {Promise<Object>} - Мерзімі өткен қарызға алулар туралы ақпарат
 */
const checkOverdueBorrows = async () => {
  try {
    const response = await api.get('/borrows/check-overdue');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Қайтару күні жақындаған қарызға алулар үшін еске салғыштар жіберу
 * 
 * @returns {Promise<Object>} - Еске салғыштар жіберу нәтижесі
 */
const sendDueReminders = async () => {
  try {
    const response = await api.get('/borrows/send-reminders');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Қарызға алу статистикасын алу
 * 
 * @returns {Promise<Object>} - Қарызға алу статистикасы
 */
const getBorrowStats = async () => {
  try {
    const response = await api.get('/borrows/stats');
    return response;
  } catch (error) {
    throw error;
  }
};

// Экспорттар
const borrowService = {
  getUserBorrows,
  getAllBorrows,
  getBorrow,
  borrowBook,
  returnBook,
  extendBorrow,
  updateBorrow,
  checkOverdueBorrows,
  sendDueReminders,
  getBorrowStats
};

export default borrowService;