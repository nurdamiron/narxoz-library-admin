// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

/**
 * Аутентификация контексті
 * 
 * @description Бұл контекст пайдаланушының аутентификация күйін және
 * рөлін басқарады. Компоненттер осы контекстті пайдалану арқылы
 * пайдаланушының кіру/шығу күйі мен рұқсаттарын тексере алады.
 */

// Контекст жасау
export const AuthContext = createContext();

/**
 * Аутентификация контекст провайдері
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {React.ReactNode} props.children - Балалар компоненттер
 * @returns {JSX.Element} - Провайдер компоненті
 */
export const AuthProvider = ({ children }) => {
  // Пайдаланушының аутентификацияланған күйі
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );
  
  // Ағымдағы пайдаланушы туралы мәліметтер
  const [currentUser, setCurrentUser] = useState(null);
  
  // Жүктеу күйі
  const [loading, setLoading] = useState(true);
  
  // Контекст қатесі
  const [error, setError] = useState(null);

  /**
   * Пайдаланушының аутентификация күйін тексеру
   */
  const checkAuthStatus = useCallback(() => {
    setLoading(true);
    setError(null);
    
    try {
      // Аутентификация күйін жаңарту
      authService.refreshAuthState();
      
      const authenticated = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      
      console.log('Аутентификация күйі тексерілді - аутентификацияланған:', authenticated);
      console.log('Аутентификация күйі тексерілді - пайдаланушы:', user);
      
      // Пайдаланушы рөлін тексеру
      if (user) {
        console.log('Пайдаланушы рөлі:', user.role);
      } else {
        console.warn('Аутентификация тексеруінде пайдаланушы мәліметтері жоқ');
      }
      
      setIsAuthenticated(authenticated);
      setCurrentUser(user);
    } catch (err) {
      console.error('Аутентификация күйін тексеру қатесі:', err);
      setError('Аутентификация күйін тексеру қатесі');
      
      // Қате болған жағдайда мәліметтерді тазалау
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Компонент жүктелген кезде инициализация
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  /**
   * Жүйеге кіру
   * 
   * @param {Object} credentials - Кіру мәліметтері
   * @param {string} credentials.email - Пайдаланушы email-і
   * @param {string} credentials.password - Құпия сөз
   * @returns {Promise<Object>} - Пайдаланушы мәліметтері
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const { email, password } = credentials;
      
      const user = await authService.login(email, password);
      
      // Пайдаланушы рөлінің бар екенін тексеру
      if (user && !user.role) {
        if (email === 'admin@narxoz.kz') {
          user.role = 'admin';
        } else {
          user.role = 'user';
        }
        authService.updateUserData(user);
      }
      
      setIsAuthenticated(true);
      setCurrentUser(user);
      
      return user;
    } catch (err) {
      console.error('Кіру қатесі:', err);
      setError(err.message || 'Жүйеге кіру кезінде қате орын алды');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Жүйеден шығу
   */
  const logout = () => {
    setLoading(true);
    
    try {
      authService.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
    } catch (err) {
      console.error('Шығу қатесі:', err);
      setError('Жүйеден шығу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Пайдаланушының белгілі бір рөл(дер)ге ие екенін тексеру
   * 
   * @param {Array<string>|string} roles - Рұқсат етілген рөл(дер)
   * @returns {boolean} - Пайдаланушының рөлі бар-жоғы
   */
  const hasRole = (roles) => {
    if (!currentUser || !roles) {
      console.warn('hasRole тексеруі сәтсіз - мәліметтер жетіспейді', { 
        hasCurrentUser: !!currentUser, 
        userRole: currentUser?.role,
        roles 
      });
      return false;
    }
    
    // Рөлдер жалғыз жол ретінде берілген болса, массивке айналдыру
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    
    // admin@narxoz.kz үшін арнайы жағдай
    if (currentUser.email === 'admin@narxoz.kz' && rolesToCheck.includes('admin')) {
      return true;
    }
    
    // Пайдаланушы рөлі берілген рөлдер тізімінде бар ма
    const hasMatchingRole = rolesToCheck.includes(currentUser.role);
    console.log(`Рөл тексеруі: пайдаланушы рөлі ${currentUser.role}, тексерілетін рөлдер ${rolesToCheck.join(', ')} = ${hasMatchingRole}`);
    
    return hasMatchingRole;
  };

  /**
   * Ағымдағы пайдаланушы мәліметтерін жаңарту
   * 
   * @param {Object} userData - Жаңа пайдаланушы мәліметтері
   */
  const updateCurrentUser = (userData) => {
    if (userData) {
      // Рөлдің бар екенін тексеру
      if (!userData.role) {
        if (userData.email === 'admin@narxoz.kz') {
          userData.role = 'admin';
        } else {
          userData.role = 'user';
        }
      }
      
      // Жаңа мәліметтерді сақтау
      authService.updateUserData(userData);
      setCurrentUser(userData);
    }
  };

  // Контекст мәндері
  const authContextValue = {
    loading,
    error,
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

/**
 * Аутентификация хукі
 * 
 * @description Бұл хук AuthContext-ке оңай қол жеткізуге мүмкіндік береді
 * @returns {Object} AuthContext мәндері
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth хукі AuthProvider ішінде пайдаланылуы керек');
  }
  
  return context;
};

export default AuthContext;