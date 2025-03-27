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
    
    // Валидация полей
    if (!email || !password) {
      setError('Email және құпия сөз енгізіңіз');
      return;
    }
    
    setLoading(true);
    setError('');
  
    try {
      // Попытка входа через сервис аутентификации
      const userData = await login(email, password);
      
      // Проверка успешного входа и сохраненных данных
      console.log('Login successful, user data:', userData);
      
      // Верификация сохраненных данных
      const storedUser = localStorage.getItem('auth_user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      console.log('Stored user data:', parsedUser);
      
      // При успешном входе перенаправляем на главную страницу
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      // Показываем пользователю понятное сообщение об ошибке
      setError(error.message || 'Кіру кезінде қате орын алды. Тіркелгі деректерін тексеріңіз.');
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
                disabled={loading}
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
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
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
              
              {/* Подсказка для разработки */}
              {process.env.NODE_ENV === 'development' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Demo режим: admin@narxoz.kz / Admin123!
                  </Typography>
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;