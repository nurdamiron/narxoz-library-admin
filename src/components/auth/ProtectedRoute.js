import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

/**
 * Қорғалған маршрут компоненті
 * 
 * @description Бұл компонент тек аутентификацияланған пайдаланушыларға 
 * қол жетімді мазмұнды қорғау үшін қолданылады. Егер пайдаланушы 
 * аутентификацияланбаған болса, ол логин бетіне бағытталады.
 * 
 * @param {object} props - Компонент параметрлері 
 * @param {React.ReactNode} props.children - Қорғалатын компонент
 * @param {Array<string>} [props.allowedRoles] - Рұқсат етілген пайдаланушы рөлдері
 * @returns {JSX.Element} Қорғалған контент немесе логин бетіне бағыттау
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentUser, loading, checkAuthStatus } = useAuth();
  const location = useLocation();

  // При монтировании компонента проверяем актуальность аутентификации
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Пока проверяем аутентификацию, показываем спиннер
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    // Сохраняем текущий путь для возврата после входа
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Если указаны разрешенные роли, проверяем роль пользователя
  if (allowedRoles && allowedRoles.length > 0) {
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      // Если роль не соответствует, перенаправляем на главную страницу
      return <Navigate to="/" replace />;
    }
  }
  
  // Проверки пройдены, отображаем защищенный контент
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;