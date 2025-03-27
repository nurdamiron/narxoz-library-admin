import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';
import PropTypes from 'prop-types';

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
  // Пайдаланушы аутентификацияланғанын тексеру
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Егер пайдаланушы аутентификацияланбаған болса, оны логин бетіне бағыттау
    return <Navigate to="/login" replace />;
  }
  
  // Егер рөлдер көрсетілген болса, тексеру қажет
  if (allowedRoles && allowedRoles.length > 0) {
    const currentUser = authService.getCurrentUser();
    
    // Пайдаланушы рөлінің рұқсат етілген рөлдер тізімінде болуын тексеру
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      // Рөл сәйкес келмесе, басты бетке бағыттау
      return <Navigate to="/" replace />;
    }
  }
  
  // Барлық тексерулер өтті, қорғалған мазмұнды көрсету
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;