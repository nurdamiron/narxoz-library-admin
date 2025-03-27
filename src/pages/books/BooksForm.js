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

const BooksForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Состояния
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // Состояние формы
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    categoryId: '',
    description: '',
    publicationYear: '',
    language: '',
    totalCopies: '',
    availableCopies: '',
    isbn: '',
    cover: 'default-book-cover.jpg'
  });

  // Состояние ошибок валидации
  const [formErrors, setFormErrors] = useState({
    title: '',
    author: '',
    categoryId: '',
    description: '',
    publicationYear: '',
    language: '',
    totalCopies: '',
    isbn: ''
  });

  // Загрузка данных книги при редактировании
  useEffect(() => {
    if (isEditMode) {
      // В реальном приложении здесь будет запрос к API для получения данных книги
      setTimeout(() => {
        setFormData({
          title: 'Қазақ әдебиетінің тарихы',
          author: 'Мұхтар Әуезов',
          categoryId: '1',
          description: 'Қазақ әдебиетінің тарихы туралы кең ауқымды зерттеу',
          publicationYear: '2018',
          language: 'Казахский',
          totalCopies: '10',
          availableCopies: '5',
          isbn: '9789965357528',
          cover: 'default-book-cover.jpg'
        });
        setCoverPreview('/path/to/sample/cover.jpg');
        setLoading(false);
      }, 1000);
    }

    // Загрузка списка категорий
    // В реальном приложении здесь будет запрос к API
    setCategories([
      { id: '1', name: 'Әдебиет' },
      { id: '2', name: 'Экономика' },
      { id: '3', name: 'Математика' },
      { id: '4', name: 'Қаржы' },
      { id: '5', name: 'Маркетинг' },
      { id: '6', name: 'Информатика' },
      { id: '7', name: 'Бухгалтерия' },
      { id: '8', name: 'Менеджмент' },
      { id: '9', name: 'Бизнес' },
      { id: '10', name: 'Саясаттану' },
      { id: '11', name: 'Физика' }
    ]);
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

    // Автоматическое обновление доступных копий при изменении общего количества
    if (name === 'totalCopies' && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        availableCopies: value
      }));
    }
  };

  // Обработчик загрузки обложки
  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      
      // Создание URL для предпросмотра
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Удаление загруженной обложки
  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    
    // В режиме редактирования устанавливаем обложку по умолчанию
    if (isEditMode) {
      setFormData({
        ...formData,
        cover: 'default-book-cover.jpg'
      });
    }
  };

  // Валидация формы
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = 'Кітап атауын енгізіңіз';
      isValid = false;
    } else if (formData.title.length < 2 || formData.title.length > 100) {
      errors.title = 'Атау 2-100 таңба аралығында болуы керек';
      isValid = false;
    }

    if (!formData.author.trim()) {
      errors.author = 'Автор атын енгізіңіз';
      isValid = false;
    } else if (formData.author.length < 2 || formData.author.length > 100) {
      errors.author = 'Автор аты 2-100 таңба аралығында болуы керек';
      isValid = false;
    }

    if (!formData.categoryId) {
      errors.categoryId = 'Категорияны таңдаңыз';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Сипаттаманы енгізіңіз';
      isValid = false;
    }

    if (!formData.publicationYear) {
      errors.publicationYear = 'Жарияланған жылды енгізіңіз';
      isValid = false;
    } else {
      const year = parseInt(formData.publicationYear, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1000 || year > currentYear) {
        errors.publicationYear = `Жыл 1000 мен ${currentYear} аралығында болуы керек`;
        isValid = false;
      }
    }

    if (!formData.language) {
      errors.language = 'Тілді таңдаңыз';
      isValid = false;
    }

    if (!formData.totalCopies) {
      errors.totalCopies = 'Даналар санын енгізіңіз';
      isValid = false;
    } else {
      const copies = parseInt(formData.totalCopies, 10);
      if (isNaN(copies) || copies < 1) {
        errors.totalCopies = 'Даналар саны кем дегенде 1 болуы керек';
        isValid = false;
      }
    }

    if (formData.isbn && !isValidISBN(formData.isbn)) {
      errors.isbn = 'Жарамды ISBN нөмірін енгізіңіз';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Проверка формата ISBN
  const isValidISBN = (isbn) => {
    // Простая проверка - более сложная валидация может быть реализована при необходимости
    const regex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
    return regex.test(isbn);
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
      
      // Перенаправление на список книг после короткой задержки
      setTimeout(() => {
        navigate('/books');
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
          onClick={() => navigate('/books')}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="medium">
          {isEditMode ? 'Кітапты өңдеу' : 'Жаңа кітап қосу'}
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
          Кітап сәтті {isEditMode ? 'жаңартылды' : 'қосылды'}!
        </Alert>
      )}

      {/* Форма добавления/редактирования книги */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Левая колонка */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Кітап атауы"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={Boolean(formErrors.title)}
                    helperText={formErrors.title}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Автор"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    error={Boolean(formErrors.author)}
                    helperText={formErrors.author}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={Boolean(formErrors.categoryId)} required>
                    <InputLabel id="category-label">Категория</InputLabel>
                    <Select
                      labelId="category-label"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      label="Категория"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.categoryId && (
                      <FormHelperText>{formErrors.categoryId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Сипаттама"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    error={Boolean(formErrors.description)}
                    helperText={formErrors.description}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Жарияланған жыл"
                    name="publicationYear"
                    value={formData.publicationYear}
                    onChange={handleChange}
                    type="number"
                    inputProps={{ min: 1000, max: new Date().getFullYear() }}
                    error={Boolean(formErrors.publicationYear)}
                    helperText={formErrors.publicationYear}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={Boolean(formErrors.language)} required>
                    <InputLabel id="language-label">Тіл</InputLabel>
                    <Select
                      labelId="language-label"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      label="Тіл"
                    >
                      <MenuItem value="Русский">Орыс тілі</MenuItem>
                      <MenuItem value="Английский">Ағылшын тілі</MenuItem>
                      <MenuItem value="Казахский">Қазақ тілі</MenuItem>
                    </Select>
                    {formErrors.language && (
                      <FormHelperText>{formErrors.language}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Даналар саны"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleChange}
                    type="number"
                    inputProps={{ min: 1 }}
                    error={Boolean(formErrors.totalCopies)}
                    helperText={formErrors.totalCopies}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Қол жетімді даналар"
                    name="availableCopies"
                    value={formData.availableCopies}
                    onChange={handleChange}
                    type="number"
                    inputProps={{ 
                      min: 0, 
                      max: formData.totalCopies ? parseInt(formData.totalCopies, 10) : undefined 
                    }}
                    disabled={!formData.totalCopies}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ISBN"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    error={Boolean(formErrors.isbn)}
                    helperText={formErrors.isbn || 'Міндетті емес'}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Правая колонка - загрузка обложки */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Кітап мұқабасы
              </Typography>
              
              <Card
                sx={{
                  width: '100%',
                  height: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: `1px dashed ${theme.palette.divider}`,
                  position: 'relative',
                  mb: 2
                }}
              >
                {coverPreview ? (
                  <>
                    <CardMedia
                      component="img"
                      image={coverPreview}
                      alt="Кітап мұқабасы"
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        p: 2
                      }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': {
                          bgcolor: 'error.lighter',
                        }
                      }}
                      onClick={handleRemoveCover}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <Box 
                    sx={{ 
                      textAlign: 'center',
                      p: 3
                    }}
                  >
                    <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Кітап мұқабасын жүктеу үшін түртіңіз
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      PNG, JPG форматтары (макс. 5MB)
                    </Typography>
                  </Box>
                )}
              </Card>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
              >
                Мұқаба жүктеу
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleCoverChange}
                />
              </Button>
            </Grid>
            
            {/* Нижняя панель с кнопками */}
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/books')}
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

export default BooksForm;