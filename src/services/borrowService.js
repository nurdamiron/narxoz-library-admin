// src/services/borrowService.js
import api from './api';

/**
 * Service for handling book borrowing operations
 */
const borrowService = {
  /**
   * Get current user's borrows
   * 
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status
   * @returns {Promise<Object>} Borrow list and metadata
   */
  getUserBorrows: async (params = {}) => {
    try {
      const response = await api.get('/borrows', { params });
      return response;
    } catch (error) {
      console.error('Error fetching user borrows:', error);
      throw error;
    }
  },

  /**
   * Get all borrows (admin/librarian only)
   * 
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status
   * @param {number} params.userId - Filter by user ID
   * @param {number} params.bookId - Filter by book ID
   * @returns {Promise<Object>} Borrow list and metadata
   */
  getAllBorrows: async (params = {}) => {
    try {
      const response = await api.get('/borrows/all', { params });
      return response;
    } catch (error) {
      console.error('Error fetching all borrows:', error);
      throw error;
    }
  },

  /**
   * Get borrow by ID
   * 
   * @param {number|string} id - Borrow ID
   * @returns {Promise<Object>} Borrow details
   */
  getBorrow: async (id) => {
    try {
      const response = await api.get(`/borrows/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching borrow ${id}:`, error);
      throw error;
    }
  },

  /**
   * Borrow a book
   * 
   * @param {Object} data - Borrow data
   * @param {number} data.bookId - Book ID
   * @returns {Promise<Object>} New borrow details
   */
  borrowBook: async (data) => {
    try {
      const response = await api.post('/borrows', data);
      return response;
    } catch (error) {
      console.error('Error borrowing book:', error);
      throw error;
    }
  },

  /**
   * Return a borrowed book
   * 
   * @param {number|string} id - Borrow ID
   * @returns {Promise<Object>} Updated borrow details
   */
  returnBook: async (id) => {
    try {
      const response = await api.put(`/borrows/${id}/return`);
      return response;
    } catch (error) {
      console.error(`Error returning borrow ${id}:`, error);
      throw error;
    }
  },

  /**
   * Extend borrow period
   * 
   * @param {number|string} id - Borrow ID
   * @returns {Promise<Object>} Updated borrow details
   */
  extendBorrow: async (id) => {
    try {
      const response = await api.put(`/borrows/${id}/extend`);
      return response;
    } catch (error) {
      console.error(`Error extending borrow ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update borrow (admin/librarian only)
   * 
   * @param {number|string} id - Borrow ID
   * @param {Object} data - Updated borrow data
   * @returns {Promise<Object>} Updated borrow details
   */
  updateBorrow: async (id, data) => {
    try {
      const response = await api.put(`/borrows/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating borrow ${id}:`, error);
      throw error;
    }
  },

  /**
   * Check overdue borrows
   * 
   * @returns {Promise<Object>} Overdue borrows data
   */
  checkOverdueBorrows: async () => {
    try {
      const response = await api.get('/borrows/check-overdue');
      return response;
    } catch (error) {
      console.error('Error checking overdue borrows:', error);
      throw error;
    }
  },

  /**
   * Send reminders for books due soon
   * 
   * @returns {Promise<Object>} Reminder results
   */
  sendDueReminders: async () => {
    try {
      const response = await api.get('/borrows/send-reminders');
      return response;
    } catch (error) {
      console.error('Error sending reminders:', error);
      throw error;
    }
  },

  /**
   * Get borrow statistics
   * 
   * @returns {Promise<Object>} Borrow statistics
   */
  getBorrowStats: async () => {
    try {
      const response = await api.get('/borrows/stats');
      return response;
    } catch (error) {
      console.error('Error fetching borrow stats:', error);
      throw error;
    }
  }
};

export default borrowService;