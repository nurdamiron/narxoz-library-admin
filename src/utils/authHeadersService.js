// src/utils/authHeadersService.js
/**
 * Авторизация хедерлерін басқару сервисі
 * 
 * @description Бұл сервис HTTP сұраныстарға авторизация хедерлерін қосу үшін функциялар береді
 */

/**
 * Базалық аутентификация хедерін дайындау
 * 
 * @param {string} username - Пайдаланушы аты/email-і
 * @param {string} password - Құпия сөз
 * @returns {string} - Базалық аутентификация хедері
 */
const createBasicAuthHeader = (username, password) => {
    return 'Basic ' + btoa(`${username}:${password}`);
  };
  
  /**
   * Авторизация хедерлерін алу
   * 
   * @returns {Object} - Авторизация хедерлері
   */
  const getAuthHeaders = () => {
    // localStorage-дан мәліметтерді алу
    const username = localStorage.getItem('auth_username') || 'admin@narxoz.kz';
    const password = localStorage.getItem('auth_password') || 'admin123';
    const userStr = localStorage.getItem('auth_user');
    
    // Хедерлер объектісін дайындау
    const headers = {
      'Authorization': createBasicAuthHeader(username, password)
    };
    
    // Пайдаланушы мәліметтерін алу
    let user = null;
    try {
      if (userStr) {
        user = JSON.parse(userStr);
      }
    } catch (e) {
      console.error('Пайдаланушы мәліметтерін талдау қатесі:', e);
    }
    
    // Пайдаланушы рөлін хедерге қосу
    if (user && user.role) {
      headers['X-User-Role'] = user.role;
    } else if (username === 'admin@narxoz.kz') {
      // Әдепкі әкімші үшін рөлді қосу
      headers['X-User-Role'] = 'admin';
    }
    
    // Журналға жазу (отладка үшін)
    console.log('Authentication headers for:', username, 'with role:', 
      headers['X-User-Role'] || 'unknown');
    
    return headers;
  };
  
  /**
   * Авторизация хедерлерін HTTP сұранысқа қосу
   * 
   * @param {Object} config - Axios сұраныс конфигурациясы
   * @returns {Object} - Жаңартылған конфигурация
   */
  const addAuthHeaders = (config = {}) => {
    const headers = getAuthHeaders();
    
    return {
      ...config,
      headers: {
        ...config.headers,
        ...headers
      },
      withCredentials: true
    };
  };
  
  export {
    getAuthHeaders,
    addAuthHeaders,
    createBasicAuthHeader
  };