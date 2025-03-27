// src/pages/Login.js
import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Box } from '@mui/material';

/**
 * Кіру беті компоненті
 * 
 * @description Бұл компонент пайдаланушылардың жүйеге кіруіне арналған
 * бетті көрсетеді. Ол LoginForm компонентін орналастырады.
 * 
 * @returns {JSX.Element} - Кіру беті
 */
const Login = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default Login;