// src/components/forms/BookForm.js
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
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  IconButton,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Book as BookIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import bookService from '../../services/bookService';

const BookForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    publicationYear: new Date().getFullYear().toString(),
    language: 'Қазақ тілі',
    totalCopies: '1',
    availableCopies: '1',
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

  // Языки
  const languages = [
    { value: 'Қазақ тілі', label: 'Қазақ тілі' },
    { value: 'Орыс тілі', label: 'Орыс тілі' },
    { value: 'Ағылшын тілі', label: 'Ағылшын тілі' }
  ];

  // Загрузка данных книги и категорий
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Загрузка категорий
        const categoriesResponse = await bookService.getCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
        }
        
        // Если режим редактирования, загружаем данные книги
        if (isEditMode) {
          const bookResponse = await bookService.getBook(id);
          
          if (bookResponse.success && bookResponse.data) {
            const book = bookResponse.data;
            
            setFormData({
              title: book.title || '',
              author: book.author || '',
              categoryId: book.categoryId?.toString() || '',
              description: book.description || '',
              publicationYear: book.publicationYear?.toString() || '',
              language: book.language || 'Қазақ тілі',
              totalCopies: book.totalCopies?.toString() || '1',
              availableCopies: book.availableCopies?.toString() || '1',
              isbn: book.isbn || '',
              cover: book.cover || 'default-book-cover.jpg'
            });
            
            // Если есть обложка, загружаем предпросмотр
            if (book.cover && book.cover !== 'default-book-cover.jpg') {
              const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
              setCoverPreview(`${apiUrl}/uploads/covers/${book.cover}`);
            }
          }
        }
      } catch (err) {
        console.error('Деректерді жүктеу қатесі:', err);
        setError('Деректерді жүктеу кезінде қате орын алды.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Сброс ошибок при вводе
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
      
      // Проверка размера файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Файл көлемі 5МБ-дан аспауы керек');
        return;
      }
      
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
    setFormData(prev => ({
      ...prev,
      cover: 'default-book-cover.jpg'
    }));
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

    // if (formData.isbn && !isValidISBN(formData.isbn)) {
    //   errors.isbn = 'Жарамды ISBN нөмірін енгізіңіз';
    //   isValid = false;
    // }

    setFormErrors(errors);
    return isValid;
  };

  const isValidISBN = (isbn) => {
    // ISBN болмаса немесе бос болса, true қайтарамыз (міндетті емес өріс)
    if (!isbn || isbn.trim() === '') {
      return true;
    }
    
    // Барлық сызықшалар мен бос орындарды жою
    const cleanedISBN = isbn.replace(/[-\s]/g, '');
    
    // ISBN ұзындығын тексеру
    if (cleanedISBN.length !== 10 && cleanedISBN.length !== 13) {
      return false;
    }
    
    // Барлық таңбалар сандар ма екенін тексеру (ISBN-10 үшін соңғы таңба 'X' болуы мүмкін)
    if (cleanedISBN.length === 10) {
      if (!/^[0-9]{9}[0-9X]$/.test(cleanedISBN)) {
        return false;
      }
      
      // ISBN-10 тексеру сомасын есептеу
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanedISBN.charAt(i)) * (10 - i);
      }
      
      let checkDigit = 11 - (sum % 11);
      if (checkDigit === 11) {
        checkDigit = 0;
      } else if (checkDigit === 10) {
        checkDigit = 'X';
      }
      
      return checkDigit.toString() === cleanedISBN.charAt(9);
    } else {
      // ISBN-13 үшін тексеру
      if (!/^[0-9]{13}$/.test(cleanedISBN)) {
        return false;
      }
      
      // ISBN-13 тексеру сомасын есептеу
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(cleanedISBN.charAt(i)) * (i % 2 === 0 ? 1 : 3);
      }
      
      let checkDigit = 10 - (sum % 10);
      if (checkDigit === 10) {
        checkDigit = 0;
      }
      
      return checkDigit.toString() === cleanedISBN.charAt(12);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация формы
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Подготовка данных для API
      const bookData = {
        ...formData,
        totalCopies: parseInt(formData.totalCopies, 10),
        availableCopies: parseInt(formData.availableCopies, 10),
        publicationYear: parseInt(formData.publicationYear, 10),
        categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : undefined
      };
      
      // Преобразование языка в формат API
      if (bookData.language === 'Қазақ тілі') {
        bookData.language = 'Казахский';
      } else if (bookData.language === 'Орыс тілі') {
        bookData.language = 'Русский';
      } else if (bookData.language === 'Ағылшын тілі') {
        bookData.language = 'Английский';
      }
      
      let response;
      
      // Создание или обновление книги
      if (isEditMode) {
        response = await bookService.updateBook(id, bookData);
      } else {
        response = await bookService.createBook(bookData);
      }
      
      if (!response.success) {
        throw new Error(response.message || 'Кітапты сақтау кезінде қате орын алды');
      }
      
      const bookId = response.data?.id || id;
      
      // Если есть новая обложка, загружаем ее
      if (coverFile) {
        const uploadResponse = await bookService.uploadBookCover(bookId, coverFile);
        if (!uploadResponse.success) {
          console.error('Мұқабаны жүктеу қатесі:', uploadResponse.message);
        }
      }
      
      setSuccess(true);
      
      // Переход на список книг после короткой задержки
      setTimeout(() => {
        navigate('/books');
      }, 1500);
    } catch (err) {
      console.error('Кітапты сақтау қатесі:', err);
      setError(err.message || 'Кітапты сақтау кезінде қате орын алды');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {/* Заголовок и кнопка возврата */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 2 : 0
        }}>
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/books')}
            sx={{ mr: isMobile ? 0 : 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="600">
            {isEditMode ? 'Кітапты өңдеу' : 'Жаңа кітап қосу'}
          </Typography>
        </Box>

        {/* Сообщения об ошибках и успешном сохранении */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Кітап сәтті {isEditMode ? 'жаңартылды' : 'қосылды'}!
          </Alert>
        )}

        {/* Форма добавления/редактирования книги */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {/* Левая колонка - основная информация */}
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
                      variant="outlined"
                      placeholder="Кітап атауын енгізіңіз"
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                      variant="outlined"
                      placeholder="Автор атын енгізіңіз"
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                        placeholder="Категорияны таңдаңыз"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id.toString()}>
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
                      variant="outlined"
                      placeholder="Кітап сипаттамасын енгізіңіз"
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                      variant="outlined"
                      placeholder="Жылды енгізіңіз"
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                        {languages.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
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
                      variant="outlined"
                      placeholder="Даналар санын енгізіңіз"
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                      variant="outlined"
                      placeholder="Қол жетімді даналар санын енгізіңіз"
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                      variant="outlined"
                      placeholder="ISBN нөмірін енгізіңіз"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              {/* Правая колонка - загрузка обложки */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                  Кітап мұқабасы
                </Typography>
                
                <Card
                  sx={{
                    width: '100%',
                    height: isMobile ? 200 : 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                    position: 'relative',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                    }
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
                          boxShadow: 2,
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
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      <BookIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        Кітап мұқабасын жүктеу үшін түртіңіз
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
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
                  sx={{ 
                    py: 1.5,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
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
                <Divider sx={{ my: 2 }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 2
                }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/books')}
                    disabled={saving}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 500,
                      order: isMobile ? 2 : 1
                    }}
                    fullWidth={isMobile}
                  >
                    Бас тарту
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={saving}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: 2,
                      order: isMobile ? 1 : 2
                    }}
                    fullWidth={isMobile}
                  >
                    {saving ? 'Сақталуда...' : 'Сақтау'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default BookForm;