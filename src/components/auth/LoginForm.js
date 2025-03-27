// src/components/auth/LoginForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Container,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

/**
 * Жүйеге кіру формасы компоненті
 * 
 * @description Бұл компонент пайдаланушылардың жүйеге кіру үшін email және
 * құпия сөзін енгізуіне мүмкіндік беретін форманы көрсетеді.
 * 
 * @returns {JSX.Element} - Кіру формасы
 */
const LoginForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading, error: authError } = useAuth();
  
  // Кіргеннен кейін қайда бағыттау керек
  const from = location.state?.from?.pathname || '/';
  
  // Форма күйі
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Егер пайдаланушы аутентификацияланған болса, оны бағыттау
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // AuthContext-тен қате келген кезде оны көрсету
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);
  
  /**
   * Құпия сөз көрінуін ауыстыру
   */
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  /**
   * Email енгізу өрісін өңдеу
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Енгізу кезінде қатені тазалау
  };
  
  /**
   * Құпия сөз енгізу өрісін өңдеу
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // Енгізу кезінде қатені тазалау
  };
  
  /**
   * Форманы жіберуді өңдеу
   * 
   * @param {Event} e - Оқиға объектісі
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Форма өрістерін тексеру
    if (!email.trim()) {
      setError('Email енгізіңіз');
      return;
    }
    
    if (!password.trim()) {
      setError('Құпия сөзді енгізіңіз');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // AuthContext арқылы жүйеге кіру
      await login({ email, password, rememberMe });
      
      // Сәтті кіру кезінде бағыттау
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Кіру қатесі:', err);
      setError(err.message || 'Жүйеге кіру кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };
  
  // Сервис немесе компонент жүктелуін тексеру
  const isLoading = loading || authLoading;
  
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          {/* Форма тақырыбы */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Нархоз Кітапхана
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Жүйеге кіру
            </Typography>
          </Box>

          {/* Қате хабарламасы */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Кіру формасы */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              margin="normal"
              required
              disabled={isLoading}
              autoComplete="email"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Құпия сөз"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              margin="normal"
              required
              disabled={isLoading}
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      disabled={isLoading}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ py: 1.5, mt: 1, mb: 2, borderRadius: 1 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Кіру'
              )}
            </Button>
          </form>

          
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;