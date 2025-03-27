// src/services/api.js - исправленная версия

import axios from 'axios';

// Базовый URL API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создание экземпляра axios с настройками по умолчанию
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для добавления токена авторизации к каждому запросу
apiClient.interceptors.request.use(
  (config) => {    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Обработка ошибок авторизации (401, 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Авторизация қатесі:', error.response.data);
      
      // Если токен просрочен или недействителен, перенаправляем на страницу входа
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;