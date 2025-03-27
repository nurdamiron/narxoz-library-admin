// src/services/bookService.js
import axios from 'axios';
import { getAuthHeaders } from '../utils/authHeadersService';

/**
 * Кітаптармен жұмыс істеуге арналған сервис
 * 
 * @description Бұл сервис кітаптарды басқаруға арналған API функцияларын ұсынады
 */

// API базалық URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const bookService = {
  /**
   * Кітаптар тізімін алу
   * 
   * @param {Object} params - Сұраныс параметрлері
   * @returns {Promise<Object>} Нәтиже
   */
  getBooks: async (params = {}) => {
    try {
      const headers = getAuthHeaders();
      console.log('Fetching books with headers:', headers);
      
      const response = await axios.get(`${API_URL}/books`, {
        params,
        headers,
        withCredentials: true
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        total: response.data.total || response.data.length,
        message: 'Кітаптар сәтті жүктелді'
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Кітаптарды жүктеу қатесі'
      };
    }
  },

  /**
   * Кітапты ID бойынша алу
   * 
   * @param {string|number} id - Кітап ID
   * @returns {Promise<Object>} Нәтиже
   */
  getBook: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/books/${id}`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Кітап сәтті жүктелді'
      };
    } catch (error) {
      console.error(`Error fetching book with ID ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Кітапты жүктеу қатесі'
      };
    }
  },

  /**
   * Жаңа кітап жасау
   * 
   * @param {Object} bookData - Кітап мәліметтері
   * @returns {Promise<Object>} Нәтиже
   */
  createBook: async (bookData) => {
    try {
      // Аутентификация хедерлерін алу
      const headers = getAuthHeaders();
      
      // Консольде сұранысты логирлеу
      console.log('Creating book with data:', bookData);
      console.log('Using auth headers:', headers);

      // Сұранысты жіберу
      const response = await axios.post(`${API_URL}/books`, bookData, {
        headers,
        withCredentials: true
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Кітап сәтті жасалды'
      };
    } catch (error) {
      console.error('Error creating book:', error);
      console.error('Error details:', error.response?.data);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Кітапты жасау қатесі'
      };
    }
  },

  /**
   * Кітапты жаңарту
   * 
   * @param {string|number} id - Кітап ID
   * @param {Object} bookData - Жаңартылған кітап мәліметтері
   * @returns {Promise<Object>} Нәтиже
   */
  updateBook: async (id, bookData) => {
    try {
      const response = await axios.put(`${API_URL}/books/${id}`, bookData, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Кітап сәтті жаңартылды'
      };
    } catch (error) {
      console.error(`Error updating book with ID ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Кітапты жаңарту қатесі'
      };
    }
  },

  /**
   * Кітапты жою
   * 
   * @param {string|number} id - Кітап ID
   * @returns {Promise<Object>} Нәтиже
   */
  deleteBook: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/books/${id}`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Кітап сәтті жойылды'
      };
    } catch (error) {
      console.error(`Error deleting book with ID ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Кітапты жою қатесі'
      };
    }
  },

  /**
   * Кітап мұқабасын жүктеу
   * 
   * @param {string|number} id - Кітап ID
   * @param {File} file - Мұқаба файлы
   * @returns {Promise<Object>} Нәтиже
   */
  uploadBookCover: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/books/${id}/cover`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Мұқаба сәтті жүктелді'
      };
    } catch (error) {
      console.error(`Error uploading cover for book with ID ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Мұқабаны жүктеу қатесі'
      };
    }
  },

  /**
   * Категориялар тізімін алу
   * 
   * @returns {Promise<Object>} Нәтиже
   */
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/books/categories`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Категориялар сәтті жүктелді'
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Категорияларды жүктеу қатесі'
      };
    }
  },

  /**
   * Жаңа категория жасау
   * 
   * @param {Object} categoryData - Категория мәліметтері
   * @returns {Promise<Object>} Нәтиже
   */
  createCategory: async (categoryData) => {
    try {
      const response = await axios.post(`${API_URL}/books/categories`, categoryData, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Категория сәтті жасалды'
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Категорияны жасау қатесі'
      };
    }
  },

  /**
   * Категорияны жаңарту
   * 
   * @param {string|number} id - Категория ID
   * @param {Object} categoryData - Жаңартылған категория мәліметтері
   * @returns {Promise<Object>} Нәтиже
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await axios.put(`${API_URL}/books/categories/${id}`, categoryData, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Категория сәтті жаңартылды'
      };
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Категорияны жаңарту қатесі'
      };
    }
  },

  /**
   * Категорияны жою
   * 
   * @param {string|number} id - Категория ID
   * @returns {Promise<Object>} Нәтиже
   */
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/books/categories/${id}`, {
        headers: getAuthHeaders(),
        withCredentials: true
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Категория сәтті жойылды'
      };
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || 'Категорияны жою қатесі'
      };
    }
  }
};

export default bookService;