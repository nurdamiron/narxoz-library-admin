import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Аутентификация үшін хук
 * 
 * @description Бұл хук AuthContext-ке оңай қол жеткізуді қамтамасыз етеді
 * және компоненттерде аутентификация мен авторизацияға қатысты функцияларды пайдалануды жеңілдетеді.
 * 
 * @returns {Object} Авторизация контекстінің барлық мәндері мен әдістері:
 * @returns {boolean} isAuthenticated - Пайдаланушы аутентификацияланған ба
 * @returns {Object} currentUser - Ағымдағы пайдаланушы мәліметтері
 * @returns {Function} login - Жүйеге кіру функциясы
 * @returns {Function} logout - Жүйеден шығу функциясы
 * @returns {Function} hasRole - Пайдаланушының белгілі бір рөлі бар-жоғын тексеру
 * @returns {Function} updateCurrentUser - Ағымдағы пайдаланушы мәліметтерін жаңарту
 * @returns {boolean} loading - Аутентификация жүктелу күйі
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;