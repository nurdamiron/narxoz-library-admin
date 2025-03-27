import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * Аутентификация контексті
 * 
 * @description Бұл контекст жүйедегі пайдаланушының аутентификация күйін
 * және рөлін басқарады. Бұл компоненттерге пайдаланушының кіру/шығу күйі 
 * мен рұқсаттарын тексеруге мүмкіндік береді.
 */

// Контекст жасау
export const AuthContext = createContext();

/**
 * Аутентификация контекст провайдері
 * 
 * @param {object} props - Компонент props-тары
 * @param {React.ReactNode} props.children - Балалар компоненттер
 * @returns {JSX.Element} - Провайдер компоненті
 */
export const AuthProvider = ({ children }) => {
  // Пайдаланушының аутентификацияланғанын білдіретін күй
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );
  
  // Ағымдағы пайдаланушы туралы мәліметтер
  const [currentUser, setCurrentUser] = useState(
    authService.getCurrentUser()
  );
  
  // Жүктелу күйі
  const [loading, setLoading] = useState(true);

  // Инициализация (компонент жүктелген кезде)
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Пайдаланушының аутентификация күйін тексеру
   */
  const checkAuthStatus = () => {
    setLoading(true);
    
    const authenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();
    
    setIsAuthenticated(authenticated);
    setCurrentUser(user);
    setLoading(false);
  };

  /**
   * Жүйеге кіру
   * 
   * @param {string} email - Пайдаланушы email-і
   * @param {string} password - Құпия сөз
   * @returns {Promise<object>} - Пайдаланушы мәліметтері
   */
  const login = async (email, password) => {
    try {
      const user = await authService.login(email, password);
      setIsAuthenticated(true);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Login error from context:', error);
      throw error;
    }
  };

  /**
   * Жүйеден шығу
   */
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  /**
   * Пайдаланушы рөлінің рұқсат етілген рөлдер тізімінде бар-жоғын тексеру
   * 
   * @param {Array<string>} roles - Рұқсат етілген рөлдер тізімі
   * @returns {boolean} - Рұқсат бар-жоғы
   */
  const hasRole = (roles) => {
    if (!currentUser || !roles || roles.length === 0) return false;
    return roles.includes(currentUser.role);
  };

  /**
   * Ағымдағы пайдаланушы мәліметтерін жаңарту
   * 
   * @param {object} userData - Жаңа пайдаланушы мәліметтері
   */
  const updateCurrentUser = (userData) => {
    if (userData) {
      authService.updateUserData(userData);
      setCurrentUser(userData);
    }
  };

  // Контекст мәндері
  const authContextValue = {
    loading,
    isAuthenticated,
    currentUser,
    login,
    logout,
    hasRole,
    updateCurrentUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;