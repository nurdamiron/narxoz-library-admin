// src/utils/apiDebugger.js
/**
 * Утилита для отладки API-запросов и ответов
 * Предоставляет функции для логирования запросов, ответов и ошибок API
 */

const apiDebugger = {
    /**
     * Логирование исходящего запроса к API
     * 
     * @param {string} endpoint - Конечная точка API
     * @param {string} method - HTTP метод запроса
     * @param {Object} data - Данные запроса (если есть)
     */
    logRequest: (endpoint, method, data = null) => {
      if (process.env.NODE_ENV !== 'production') {
        console.group(`🚀 API запрос: ${method} ${endpoint}`);
        console.log('📝 Данные запроса:', data);
        console.groupEnd();
      }
    },
  
    /**
     * Логирование успешного ответа от API
     * 
     * @param {string} endpoint - Конечная точка API
     * @param {Object} response - Ответ от API
     */
    logResponse: (endpoint, response) => {
      if (process.env.NODE_ENV !== 'production') {
        console.group(`✅ API ответ: ${endpoint}`);
        console.log('📊 Статус:', response.status);
        console.log('📦 Данные:', response.data);
        console.groupEnd();
      }
    },
  
    /**
     * Логирование ошибки от API
     * 
     * @param {string} endpoint - Конечная точка API
     * @param {Object} error - Объект ошибки
     */
    logError: (endpoint, error) => {
      if (process.env.NODE_ENV !== 'production') {
        console.group(`❌ API ошибка: ${endpoint}`);
        
        if (error.response) {
          // Запрос был выполнен, и сервер ответил со статусом, который
          // выходит за пределы диапазона 2xx
          console.log('📊 Статус:', error.response.status);
          console.log('📦 Данные ответа:', error.response.data);
          console.log('📋 Заголовки:', error.response.headers);
        } else if (error.request) {
          // Запрос был сделан, но ответа не получено
          console.log('📫 Ответ не получен:', error.request);
        } else {
          // Произошла ошибка при настройке запроса
          console.log('🔄 Сообщение об ошибке:', error.message);
        }
        
        console.log('⚙️ Конфигурация запроса:', error.config);
        console.groupEnd();
      }
    }
  };
  
  export default apiDebugger;