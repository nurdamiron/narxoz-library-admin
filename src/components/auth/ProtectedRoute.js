// src/components/routes/ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * Қорғалған маршрут компоненті
 * 
 * @description Бұл компонент тек аутентификацияланған пайдаланушыларға қол жетімді
 * маршруттарды қорғау үшін қолданылады. Пайдаланушы аутентификацияланбаған болса,
 * ол логин бетіне бағытталады.
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {React.ReactNode} props.children - Қорғалған мазмұн
 * @param {string|Array<string>} [props.requiredRoles] - Қол жеткізу үшін қажетті рөл(дер)
 * @returns {JSX.Element} - Қорғалған мазмұн немесе қайта бағыттау
 */
const ProtectedRoute = ({ children, requiredRoles }) => {
  const { isAuthenticated, currentUser, loading, checkAuthStatus } = useAuth();
  const location = useLocation();

  // Компонент жүктелгенде аутентификация күйін тексеру
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Аутентификация тексерілу кезінде жүктелу индикаторын көрсету
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Пайдаланушы аутентификацияланбаса, логин бетіне бағыттау
  if (!isAuthenticated) {
    // Ағымдағы маршрутты сақтау, кіргеннен кейін қайтару үшін
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Егер белгілі бір рөлдер талап етілсе, оларды тексеру
  if (requiredRoles) {
    // Рөлдерді массивке айналдыру (егер жалғыз жол болса)
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // Пайдаланушының талап етілетін рөлдерінің бар-жоғын тексеру
    const hasRequiredRole = currentUser && roles.includes(currentUser.role);
    
    // Егер қажетті рөл жоқ болса, басты бетке бағыттау
    if (!hasRequiredRole) {
      console.warn(`Пайдаланушының рөлі "${currentUser?.role}" рұқсат етілген рөлдерге сәйкес келмейді: ${roles.join(', ')}`);
      return <Navigate to="/" replace />;
    }
  }
  
  // Барлық тексерулер сәтті өтті, қорғалған мазмұнды көрсету
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ])
};

export default ProtectedRoute;