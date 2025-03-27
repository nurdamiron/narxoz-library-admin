import React, { createContext, useState, useEffect, useCallback } from 'react';
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
  const [currentUser, setCurrentUser] = useState(null);
  
  // Жүктелу күйі
  const [loading, setLoading] = useState(true);

  /**
   * Пайдаланушының аутентификация күйін тексеру
   * Используем useCallback для предотвращения бесконечных перерендеров
   */
  const checkAuthStatus = useCallback(() => {
    setLoading(true);
    
    // Try to refresh auth state (fix role if missing)
    authService.refreshAuthState();
    
    const authenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();
    
    console.log('Auth status check - authenticated:', authenticated);
    console.log('Auth status check - user:', user);
    
    // Log specifics about user role
    if (user) {
      console.log('User role from auth check:', user.role);
    } else {
      console.warn('No user data available in auth check');
    }
    
    setIsAuthenticated(authenticated);
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Инициализация (компонент жүктелген кезде)
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

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
      
      // Ensure user has a role
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
    if (!currentUser || !roles || roles.length === 0) {
      console.warn('hasRole check failed - missing data', { 
        hasCurrentUser: !!currentUser, 
        userRole: currentUser?.role,
        roles 
      });
      return false;
    }
    
    // Special case for admin@narxoz.kz
    if (currentUser.email === 'admin@narxoz.kz' && roles.includes('admin')) {
      return true;
    }
    
    const hasMatchingRole = roles.includes(currentUser.role);
    console.log(`Role check: user has role ${currentUser.role}, checking against ${roles.join(', ')} = ${hasMatchingRole}`);
    return hasMatchingRole;
  };

  /**
   * Ағымдағы пайдаланушы мәліметтерін жаңарту
   * 
   * @param {object} userData - Жаңа пайдаланушы мәліметтері
   */
  const updateCurrentUser = (userData) => {
    if (userData) {
      // Ensure role exists
      if (!userData.role) {
        if (userData.email === 'admin@narxoz.kz') {
          userData.role = 'admin';
        } else {
          userData.role = 'user';
        }
      }
      
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