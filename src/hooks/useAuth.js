// src/hooks/useAuth.js
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * useAuth хукі - аутентификация контекстін пайдалану
 * 
 * Бұл хук AuthContext контекстін пайдалануды жеңілдетеді.
 * Хукты пайдалану арқылы компоненттер аутентификация күйін және
 * оған қатысты функцияларды оңай ала алады.
 * 
 * @returns {Object} AuthContext мәні
 * @returns {boolean} AuthContext.isAuthenticated - Пайдаланушының аутентификацияланған күйі
 * @returns {Object} AuthContext.currentUser - Ағымдағы пайдаланушы мәліметтері
 * @returns {boolean} AuthContext.loading - Аутентификация процесінің жүктелу күйі
 * @returns {string} AuthContext.error - Аутентификация қатесі (егер болса)
 * @returns {Function} AuthContext.login - Жүйеге кіру функциясы
 * @returns {Function} AuthContext.logout - Жүйеден шығу функциясы
 * @returns {Function} AuthContext.hasRole - Пайдаланушы рөлін тексеру функциясы
 * @returns {Function} AuthContext.updateCurrentUser - Пайдаланушы мәліметтерін жаңарту функциясы
 * @returns {Function} AuthContext.checkAuthStatus - Аутентификация күйін тексеру функциясы
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth хукі AuthProvider ішінде пайдаланылуы керек');
  }
  
  return context;
};

export default useAuth;