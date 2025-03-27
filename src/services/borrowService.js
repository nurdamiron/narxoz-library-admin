// src/services/borrowService.js
import crudService from './crudService';

/**
 * Қарызға алу операцияларымен жұмыс істеуге арналған қызмет
 * 
 * @description Бұл сервис кітаптарды қарызға алу және қайтару операцияларын басқарады
 */
const borrowService = {
  /**
   * Пайдаланушының қарызға алуларын алу
   * 
   * @param {Object} params - Сұраныс параметрлері
   * @param {number} params.page - Бет нөмірі
   * @param {number} params.limit - Бір беттегі қарызға алулар саны
   * @param {string} params.status - Мәртебе бойынша фильтр
   * @returns {Promise<Object>} Қарызға алулар тізімі
   */
  getUserBorrows: async (params = {}) => {
    return crudService.getAll('/borrows', params);
  },

  /**
   * Барлық қарызға алуларды алу (тек әкімші/кітапханашы)
   * 
   * @param {Object} params - Сұраныс параметрлері
   * @returns {Promise<Object>} Қарызға алулар тізімі
   */
  getAllBorrows: async (params = {}) => {
    return crudService.getAll('/borrows/all', params);
  },

  /**
   * Қарызға алуды ID бойынша алу
   * 
   * @param {string|number} id - Қарызға алу ID-сі
   * @returns {Promise<Object>} Қарызға алу мәліметтері
   */
  getBorrow: async (id) => {
    return crudService.getById('/borrows', id);
  },

  /**
   * Кітапты қарызға алу
   * 
   * @param {Object} data - Қарызға алу мәліметтері
   * @param {string|number} data.bookId - Кітап ID-сі
   * @returns {Promise<Object>} Жаңа қарызға алу мәліметтері
   */
  borrowBook: async (data) => {
    return crudService.create('/borrows', data);
  },

  /**
   * Қарызға алынған кітапты қайтару
   * 
   * @param {string|number} id - Қарызға алу ID-сі
   * @returns {Promise<Object>} Жаңартылған қарызға алу мәліметтері
   */
  returnBook: async (id) => {
    return crudService.executeAction(`/borrows/${id}/return`, {}, 'put');
  },

  /**
   * Қарызға алу мерзімін ұзарту
   * 
   * @param {string|number} id - Қарызға алу ID-сі
   * @returns {Promise<Object>} Жаңартылған қарызға алу мәліметтері
   */
  extendBorrow: async (id) => {
    return crudService.executeAction(`/borrows/${id}/extend`, {}, 'put');
  },

  /**
   * Қарызға алуды жаңарту (тек әкімші/кітапханашы)
   * 
   * @param {string|number} id - Қарызға алу ID-сі
   * @param {Object} data - Жаңартылған қарызға алу мәліметтері
   * @returns {Promise<Object>} Жаңартылған қарызға алу мәліметтері
   */
  updateBorrow: async (id, data) => {
    return crudService.update('/borrows', id, data);
  },

  /**
   * Мерзімі өткен қарызға алуларды тексеру
   * 
   * @returns {Promise<Object>} Мерзімі өткен қарызға алулар мәліметтері
   */
  checkOverdueBorrows: async () => {
    return crudService.executeAction('/borrows/check-overdue', {}, 'get');
  },

  /**
   * Қарызға алу статистикасын алу
   * 
   * @returns {Promise<Object>} Қарызға алу статистикасы
   */
  getBorrowStats: async () => {
    return crudService.executeAction('/borrows/stats', {}, 'get');
  }
};

export default borrowService;