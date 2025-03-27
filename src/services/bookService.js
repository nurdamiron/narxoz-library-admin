// src/services/bookService.js
import apiClient from './api';

const bookService = {
  /**
   * Получение списка книг с фильтрацией и пагинацией
   * @param {Object} params - параметры запроса
   * @param {number} params.page - номер страницы (начиная с 1)
   * @param {number} params.limit - количество записей на странице
   * @param {string} params.search - текст для поиска
   * @param {string} params.categoryId - ID категории для фильтрации
   * @param {string} params.language - язык для фильтрации
   * @param {string} params.sort - поле для сортировки (например, "title", "-publicationYear")
   * @returns {Promise} Promise с данными книг
   */
  getBooks: async (params = {}) => {
    try {
      const response = await apiClient.get('/books', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  /**
   * Получение одной книги по ID
   * @param {string} id - ID книги
   * @returns {Promise} Promise с данными книги
   */
  getBook: async (id) => {
    try {
      const response = await apiClient.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching book ${id}:`, error);
      throw error;
    }
  },

  /**
   * Получение популярных книг
   * @param {number} limit - количество книг для получения
   * @returns {Promise} Promise с данными популярных книг
   */
  getPopularBooks: async (limit = 4) => {
    try {
      const response = await apiClient.get('/books/popular', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular books:', error);
      throw error;
    }
  },

  /**
   * Получение новых книг
   * @param {number} limit - количество книг для получения
   * @returns {Promise} Promise с данными новых книг
   */
  getNewBooks: async (limit = 4) => {
    try {
      const response = await apiClient.get('/books/new', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching new books:', error);
      throw error;
    }
  },

  /**
   * Получение всех категорий
   * @returns {Promise} Promise с данными категорий
   */
  getCategories: async () => {
    try {
      const response = await apiClient.get('/books/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Создание новой книги
   * @param {Object} bookData - данные книги
   * @returns {Promise} Promise с созданной книгой
   */
  createBook: async (bookData) => {
    const response = await apiClient.post('/books', bookData);
    return response.data;
  },

  /**
   * Обновление книги
   * @param {string} id - ID книги
   * @param {Object} bookData - данные для обновления
   * @returns {Promise} Promise с обновленной книгой
   */
  updateBook: async (id, bookData) => {
    try {
      const response = await apiClient.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      console.error(`Error updating book ${id}:`, error);
      throw error;
    }
  },

  /**
   * Удаление книги
   * @param {string} id - ID книги
   * @returns {Promise} Promise с результатом
   */
  deleteBook: async (id) => {
    try {
      const response = await apiClient.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting book ${id}:`, error);
      throw error;
    }
  },

  /**
   * Загрузка обложки книги
   * @param {string} id - ID книги
   * @param {File} file - файл обложки
   * @returns {Promise} Promise с URL обновленной обложки
   */
  uploadBookCover: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await apiClient.post(`/books/${id}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Обновление инвентаря книги
   * @param {string} id - ID книги
   * @param {Object} data - данные инвентаря
   * @returns {Promise} Promise с обновленной книгой
   */
  updateInventory: async (id, data) => {
    try {
      const response = await apiClient.put(`/books/${id}/inventory`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating book inventory for ${id}:`, error);
      throw error;
    }
  },

  /**
   * Создание новой категории
   * @param {Object} categoryData - данные категории
   * @returns {Promise} Promise с созданной категорией
   */
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/books/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Обновление категории
   * @param {string} id - ID категории
   * @param {Object} categoryData - данные для обновления
   * @returns {Promise} Promise с обновленной категорией
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`/books/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Удаление категории
   * @param {string} id - ID категории
   * @returns {Promise} Promise с результатом
   */
  deleteCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/books/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
};

export default bookService;