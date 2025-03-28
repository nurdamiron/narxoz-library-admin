import React, { useState, useEffect, useCallback } from 'react';
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
  Snackbar,
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

const BooksForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State variables
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

  // Form state
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

  // Validation errors
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

  // Languages list
  const languages = [
    { value: 'Қазақ тілі', label: 'Қазақ тілі' },
    { value: 'Орыс тілі', label: 'Орыс тілі' },
    { value: 'Ағылшын тілі', label: 'Ағылшын тілі' }
  ];

  // Memoized showSnackbar function to prevent re-renders
  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  // Load book and categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load categories
        const categoriesResponse = await bookService.getCategories();
        
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
        } else {
          showSnackbar('Категорияларды жүктеу кезінде қате орын алды', 'error');
        }
        
        // In edit mode, load book data
        if (isEditMode && id) {
          const bookResponse = await bookService.getBook(id);
          
          if (bookResponse.success && bookResponse.data) {
            const book = bookResponse.data;
            
            // Translate language to Kazakh
            let language = book.language;
            if (language === 'Казахский') {
              language = 'Қазақ тілі';
            } else if (language === 'Русский') {
              language = 'Орыс тілі';
            } else if (language === 'Английский') {
              language = 'Ағылшын тілі';
            }
            
            // Set form data
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
            
            // If there's a cover, load it
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
  }, [id, isEditMode, showSnackbar]);

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors on input
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-update available copies when total changes
    if (name === 'totalCopies' && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        availableCopies: value
      }));
    }
  };

  // Handle cover upload
  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Файл көлемі 5МБ-дан аспауы керек');
        showSnackbar('Файл көлемі 5МБ-дан аспауы керек', 'error');
        return;
      }
      
      setCoverFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded cover
  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    
    // In edit mode, set default cover
    setFormData(prev => ({
      ...prev,
      cover: 'default-book-cover.jpg'
    }));
  };

  // Validate form
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

    // Description is now optional

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

    // // ISBN is optional, but if provided it should be valid
    // if (formData.isbn && formData.isbn.trim()) {
    //   errors.isbn = 'Жарамды ISBN нөмірін енгізіңіз';
    //   isValid = false;
    // }

    setFormErrors(errors);
    return isValid;
  };

  // Check ISBN format
//   const isValidISBN = (isbn) => {
//     // Simple validation
//     const regex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
//     return regex.test(isbn);
//   };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      showSnackbar('Формада қателер бар, оларды түзетіп, қайталап көріңіз', 'error');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Prepare data for API
      const bookData = {
        ...formData,
        totalCopies: parseInt(formData.totalCopies, 10),
        availableCopies: parseInt(formData.availableCopies, 10),
        publicationYear: parseInt(formData.publicationYear, 10),
        categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : undefined
      };
      
      // Convert language to API format
      if (bookData.language === 'Қазақ тілі') {
        bookData.language = 'Казахский';
      } else if (bookData.language === 'Орыс тілі') {
        bookData.language = 'Русский';
      } else if (bookData.language === 'Ағылшын тілі') {
        bookData.language = 'Английский';
      }
      
      let response;
      
      // Create or update book
      if (isEditMode) {
        response = await bookService.updateBook(id, bookData);
      } else {
        response = await bookService.createBook(bookData);
      }
      
      if (!response.success) {
        throw new Error(response.message || 'Кітапты сақтау кезінде қате орын алды');
      }
      
      const bookId = response.data?.id || id;
      
      // If there's a new cover, upload it
      if (coverFile) {
        const uploadResponse = await bookService.uploadBookCover(bookId, coverFile);
        
        if (!uploadResponse.success) {
          console.error('Мұқабаны жүктеу қатесі:', uploadResponse.message);
          showSnackbar('Кітап сақталды, бірақ мұқабаны жүктеу кезінде қате орын алды', 'warning');
        }
      }
      
      // Show success message
      setSuccess(true);
      showSnackbar(`Кітап сәтті ${isEditMode ? 'жаңартылды' : 'қосылды'}!`, 'success');
      
      // Return to books list
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

  // Show loading indicator
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Title and back button */}
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

      {/* Error and success messages */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
        >
          Кітап сәтті {isEditMode ? 'жаңартылды' : 'қосылды'}!
        </Alert>
      )}

      {/* Book form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left column - main info */}
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
                    helperText={formErrors.description || 'Міндетті емес'}
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
                    placeholder="Кітаптың ISBN нөмірін енгізіңіз (міндетті емес)"
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Right column - cover upload */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Кітап мұқабасы
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                <Card
                  sx={{
                    width: '100%',
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
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
                          boxShadow: 1
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
                      <BookIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Кітап мұқабасын жүктеу үшін түртіңіз
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
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
              </Box>
            </Grid>
            
            {/* Bottom panel with buttons */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
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

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default BooksForm;