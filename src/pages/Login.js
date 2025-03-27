import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Container,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Кіру беті компоненті
 * 
 * @description Бұл компонент пайдаланушының жүйеге кіру интерфейсін қамтамасыз етеді.
 * Пайдаланушы кіру үшін email және құпия сөзін енгізуі қажет.
 */
const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  // Күй айнымалылары
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Если пользователь уже аутентифицирован, перенаправляем на главную страницу
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  /**
   * Кіру формасын өңдеу
   * 
   * @param {Event} e - Форма оқиғасы
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email және құпия сөз енгізіңіз');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // AuthContext арқылы кіру
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      // Қате жағдайында тиісті хабарламаны көрсету
      if (error.response) {
        if (error.response.status === 401) {
          setError('Қате email немесе құпия сөз');
        } else {
          setError(`Серверге қосылу кезінде қате орын алды: ${error.response.status}`);
        }
      } else if (error.request) {
        setError('Серверден жауап алу мүмкін болмады. Желі байланысын тексеріңіз.');
      } else {
        setError(`Қате орын алды: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mb: 3
              }}
            >
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.primary.main 
                }}
              >
                Нархоз Кітапхана
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Әкімші панеліне кіру
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Құпия сөз"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Кіру'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;