import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select,
  FormHelperText,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  Avatar,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

// Функция для генерации инициалов из имени
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const UserForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Состояния
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    faculty: '',
    specialization: '',
    studentId: '',
    year: '',
    role: 'user'
  });

  // Состояние ошибок валидации
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    faculty: '',
    specialization: '',
    studentId: '',
    year: ''
  });

  // Загрузка данных пользователя при редактировании
  useEffect(() => {
    if (isEditMode) {
      // В реальном приложении здесь будет запрос к API для получения данных пользователя
      setTimeout(() => {
        setFormData({
          name: 'Асан Серіков',
          email: 'asan.serikov@example.com',
          phone: '+7 (701) 123-4567',
          faculty: 'Экономика факультеті',
          specialization: 'Қаржы',
          studentId: 'ST12345',
          year: '3 курс',
          role: 'user'
        });
        setAvatarPreview(null); // В реальном приложении здесь будет путь к аватару, если он есть
        setLoading(false);
      }, 1000);
    }
  }, [id, isEditMode]);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Сброс ошибок при вводе
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Обработчик загрузки аватара
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Создание URL для предпросмотра
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Удаление загруженного аватара
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  // Валидация формы
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Атын енгізіңіз';
      isValid = false;
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      errors.name = 'Аты 2-50 таңба аралығында болуы керек';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email енгізіңіз';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Жарамды email енгізіңіз';
      isValid = false;
    }

    if (!formData.faculty.trim()) {
      errors.faculty = 'Факультетті енгізіңіз';
      isValid = false;
    }

    if (!formData.specialization.trim()) {
      errors.specialization = 'Мамандықты енгізіңіз';
      isValid = false;
    }

    if (!formData.studentId.trim()) {
      errors.studentId = 'Студент ID-ін енгізіңіз';
      isValid = false;
    }

    if (!formData.year.trim()) {
      errors.year = 'Курс/жылды енгізіңіз';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация формы
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);
    
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      // Имитация успешного сохранения
      setSuccess(true);
      setSaving(false);
      
      // Перенаправление на список пользователей после короткой задержки
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    }, 2000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок и кнопка возврата */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          color="inherit" 
          onClick={() => navigate('/users')}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="medium">
          {isEditMode ? 'Пайдаланушыны өңдеу' : 'Жаңа пайдаланушы қосу'}
        </Typography>
      </Box>

      {/* Сообщения об ошибках и успешном сохранении */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Пайдаланушы сәтті {isEditMode ? 'жаңартылды' : 'қосылды'}!
        </Alert>
      )}

      {/* Форма добавления/редактирования пользователя */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Левая колонка - основные данные */}
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle1" gutterBottom>
                Негізгі ақпарат
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Аты"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={Boolean(formErrors.name)}
                    helperText={formErrors.name}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={Boolean(formErrors.email)}
                    helperText={formErrors.email}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Телефон"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (7XX) XXX-XXXX"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Білім туралы ақпарат
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Факультет"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    error={Boolean(formErrors.faculty)}
                    helperText={formErrors.faculty}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Мамандық"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    error={Boolean(formErrors.specialization)}
                    helperText={formErrors.specialization}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Студент ID"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    error={Boolean(formErrors.studentId)}
                    helperText={formErrors.studentId}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Курс/Жыл"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    error={Boolean(formErrors.year)}
                    helperText={formErrors.year}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Рөл және құқықтар
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="role-label">Пайдаланушы рөлі</InputLabel>
                    <Select
                      labelId="role-label"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      label="Пайдаланушы рөлі"
                    >
                      <MenuItem value="user">Оқырман</MenuItem>
                      <MenuItem value="librarian">Кітапханашы</MenuItem>
                      <MenuItem value="admin">Әкімші</MenuItem>
                    </Select>
                    <FormHelperText>
                      {formData.role === 'admin' 
                        ? 'Әкімші барлық әрекеттерді орындай алады' 
                        : formData.role === 'librarian'
                        ? 'Кітапханашы кітаптарды және қарыздарды басқара алады'
                        : 'Оқырмандар кітаптарды қарызға ала алады'}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Правая колонка - аватар */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Аватар
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                {avatarPreview ? (
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={avatarPreview}
                      alt={formData.name}
                      sx={{ width: 150, height: 150 }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: -10,
                        top: -10,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': {
                          bgcolor: 'error.lighter',
                        }
                      }}
                      onClick={handleRemoveAvatar}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Avatar
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '3rem'
                    }}
                  >
                    {getInitials(formData.name)}
                  </Avatar>
                )}
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  sx={{ mt: 2 }}
                >
                  Аватар жүктеу
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarChange}
                  />
                </Button>
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Рұқсат етілген форматтар: JPG, PNG, GIF<br />
                  Максималды өлшемі: 2MB
                </Typography>
              </Box>
            </Grid>
            
            {/* Нижняя панель с кнопками */}
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/users')}
                  disabled={saving}
                >
                  Бас тарту
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Сақталуда...' : 'Сақтау'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default UserForm;