// src/pages/books/BooksForm.js

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
  useMediaQuery,
  FormHelperText,
  Snackbar,
  SnackbarContent,
  Backdrop
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Book as BookIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import bookService from '../../services/bookService';

const BooksForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Күй айнымалылары
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Форма күйі
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

  // Валидация қателері
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

  // Тілдер тізімі
  const languages = [
    { value: 'Қазақ тілі', label: 'Қазақ тілі' },
    { value: 'Орыс тілі', label: 'Орыс тілі' },
    { value: 'Ағылшын тілі', label: 'Ағылшын тілі' }
  ];

  // Кітап және категориялар деректерін жүктеу
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Категорияларды жүктеу
        const categoriesResponse = await bookService.getCategories();
        console.log('Categories response:', categoriesResponse);
        
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
        } else {
          showSnackbar('Категорияларды жүктеу кезінде қате орын алды', 'error');
        }
        
        // Өңдеу режимінде кітап деректерін жүктеу
        if (isEditMode) {
          const bookResponse = await bookService.getBook(id);
          console.log('Book response:', bookResponse);
          
          if (bookResponse.success && bookResponse.data) {
            const book = bookResponse.data;
            
            // Кітап тілін қазақшаға аудару
            let language = book.language;
            if (language === 'Казахский') {
              language = 'Қазақ тілі';
            } else if (language === 'Русский') {
              language = 'Орыс тілі';
            } else if (language === 'Английский') {
              language = 'Ағылшын тілі';
            }
            
            // Форма деректерін орнату
            setFormData({
              title: book.title || '',
              author: book.author || '',
              categoryId: book.categoryId?.toString() || '',
              description: book.description || '',
              publicationYear: book.publicationYear?.toString() || '',
              language: language,
              totalCopies: book.totalCopies?.toString() || '1',
              availableCopies: book.availableCopies?.toString() || '1',
              isbn: book.isbn || '',
              cover: book.cover || 'default-book-cover.jpg'
            });
            
            // Мұқаба бар болса, оны жүктеу
            if (book.cover && book.cover !== 'default-book-cover.jpg') {
              const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
              setCoverPreview(`${apiUrl}/uploads/covers/${book.cover}`);
            }
          } else {
            showSnackbar('Кітап деректерін жүктеу кезінде қате орын алды', 'error');
          }
        }
      } catch (err) {
        console.error('Деректерді жүктеу қатесі:', err);
        setError('Деректерді жүктеу кезінде қате орын алды');
        showSnackbar('Деректерді жүктеу кезінде қате орын алды', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Snackbar көрсету функциясы
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Snackbar жабу функциясы
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Форма өрістерінің өзгеруін өңдеу
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Енгізу кезінде қателерді тазалау
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Жалпы дана санын өзгерткенде, қол жетімді даналарды автоматты түрде жаңарту
    if (name === 'totalCopies' && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        availableCopies: value
      }));
    }
  };

  // Мұқаба жүктеу функциясы
  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Файл өлшемін тексеру (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Файл көлемі 5МБ-дан аспауы керек');
        showSnackbar('Файл көлемі 5МБ-дан аспауы керек', 'error');
        return;
      }
      
      setCoverFile(file);
      
      // Алдын ала қарау URL жасау
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Мұқабаны жою функциясы
  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    
    // Өңдеу режимінде әдепкі мұқабаны орнату
    setFormData(prev => ({
      ...prev,
      cover: 'default-book-cover.jpg'
    }));
  };

  // Форманы валидациялау
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

  // ISBN форматын тексеру
  const isValidISBN = (isbn) => {
    // Қарапайым тексеру
    const regex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
    return regex.test(isbn);
  };

  // Форманы жіберу функциясы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Форманы валидациялау
    if (!validateForm()) {
      showSnackbar('Формада қателер бар, оларды түзетіп, қайталап көріңіз', 'error');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // API үшін деректерді дайындау
      const bookData = {
        ...formData,
        totalCopies: parseInt(formData.totalCopies, 10),
        availableCopies: parseInt(formData.availableCopies, 10),
        publicationYear: parseInt(formData.publicationYear, 10),
        categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : undefined
      };
      
      // Тілді API форматына түрлендіру
      if (bookData.language === 'Қазақ тілі') {
        bookData.language = 'Казахский';
      } else if (bookData.language === 'Орыс тілі') {
        bookData.language = 'Русский';
      } else if (bookData.language === 'Ағылшын тілі') {
        bookData.language = 'Английский';
      }
      
      console.log('Submitting book data:', bookData);
      let response;
      
      // Кітапты жасау немесе жаңарту
      if (isEditMode) {
        response = await bookService.updateBook(id, bookData);
      } else {
        response = await bookService.createBook(bookData);
      }
      
      console.log('Book save response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Кітапты сақтау кезінде қате орын алды');
      }
      
      const bookId = response.data?.id || id;
      
      // Жаңа мұқаба болса, оны жүктеу
      if (coverFile) {
        const uploadResponse = await bookService.uploadBookCover(bookId, coverFile);
        console.log('Cover upload response:', uploadResponse);
        
        if (!uploadResponse.success) {
          console.error('Мұқабаны жүктеу қатесі:', uploadResponse.message);
          showSnackbar('Кітап сақталды, бірақ мұқабаны жүктеу кезінде қате орын алды', 'warning');
        }
      }
      
      // Сәтті сақтау хабарламасы
      setSuccess(true);
      showSnackbar(`Кітап сәтті ${isEditMode ? 'жаңартылды' : 'қосылды'}!`, 'success');
      
      // Кітаптар тізіміне қайту
      setTimeout(() => {
        navigate('/books');
      }, 1500);
    } catch (err) {
      console.error('Кітапты сақтау қатесі:', err);
      setError(err.message || 'Кітапты сақтау кезінде қате орын алды');
      showSnackbar('Кітапты сақтау кезінде қате орын алды: ' + 
        (err.message || 'Белгісіз қате'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={isMobile ? 40 : 60} />
        <Typography color="text.secondary">
          Деректер жүктелуде...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: { xs: 2, sm: 3 } }}>
        {/* Тақырып және кері қайту батырмасы */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 2, sm: 4 },
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 1 : 0
        }}>
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/books')}
            sx={{ mr: isMobile ? 0 : 2 }}
            aria-label="Артқа қайту"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="h1"
            fontWeight="600"
          >
            {isEditMode ? 'Кітапты өңдеу' : 'Жаңа кітап қосу'}
          </Typography>
        </Box>

        {/* Қателер мен сәтті сақтау хабарламалары */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }} 
            onClose={() => setError(null)}
            variant="filled"
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            variant="filled"
          >
            Кітап сәтті {isEditMode ? 'жаңартылды' : 'қосылды'}!
          </Alert>
        )}

        {/* Кітап қосу/өңдеу формасы */}
        <Paper 
          elevation={isMobile ? 2 : 3} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: isMobile 
              ? '0 2px 10px rgba(0,0,0,0.05)' 
              : '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* Сол жақ колонка - негізгі ақпарат */}
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
                      size={isMobile ? "small" : "medium"}
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
                      size={isMobile ? "small" : "medium"}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl 
                      fullWidth 
                      error={Boolean(formErrors.categoryId)} 
                      required
                      size={isMobile ? "small" : "medium"}
                    >
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
                      rows={isMobile ? 3 : 4}
                      error={Boolean(formErrors.description)}
                      helperText={formErrors.description}
                      required
                      variant="outlined"
                      placeholder="Кітап сипаттамасын енгізіңіз"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size={isMobile ? "small" : "medium"}
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
                      size={isMobile ? "small" : "medium"}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl 
                      fullWidth 
                      error={Boolean(formErrors.language)} 
                      required
                      size={isMobile ? "small" : "medium"}
                    >
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
                      size={isMobile ? "small" : "medium"}
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
                      size={isMobile ? "small" : "medium"}
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
                      size={isMobile ? "small" : "medium"}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              {/* Оң жақ колонка - мұқаба жүктеу */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                  Кітап мұқабасы
                </Typography>
                
                <Card
                  sx={{
                    width: '100%',
                    height: { xs: 200, sm: 250, md: 300 },
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
                        aria-label="Мұқабаны жою"
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
                  size={isMobile ? "small" : "medium"}
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
              
              {/* Төменгі панель - батырмалар */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  flexDirection: isMobile ? 'column-reverse' : 'row',
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
                      fontWeight: 500
                    }}
                    fullWidth={isMobile}
                    size={isMobile ? "large" : "medium"}
                  >
                    Бас тарту
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={saving}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: 2
                    }}
                    fullWidth={isMobile}
                    size={isMobile ? "large" : "medium"}
                  >
                    {saving ? 'Сақталуда...' : 'Сақтау'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
      
      {/* Snackbar хабарламасы */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ 
          vertical: 'bottom', 
          horizontal: 'center' 
        }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: snackbarSeverity === 'success' 
              ? theme.palette.success.main 
              : snackbarSeverity === 'error'
                ? theme.palette.error.main
                : theme.palette.warning.main,
          }}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
      
      {/* Ауыр есептеу кезінде жүктеу экраны */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={saving}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2
        }}>
          <CircularProgress color="inherit" />
          <Typography variant="body1" color="inherit">
            Кітап сақталуда...
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default BooksForm;