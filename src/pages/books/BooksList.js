// src/pages/books/BooksList.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Button, 
  Typography, 
  Alert,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import bookService from '../../services/bookService';

// Component imports
import BooksTable from './components/BooksTable';
import BooksFilter from './components/BooksFilter';
import LoadingBackdrop from '../../components/common/LoadingBackdrop';
import CustomSnackbar from '../../components/common/CustomSnackbar';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';

const BooksList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Күй айнымалылары
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [totalBooks, setTotalBooks] = useState(0);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [filter, setFilter] = useState({
    category: '',
    language: '',
    availability: ''
  });
  
  // Кітаптарды жүктеу
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Сұраныс параметрлерін дайындау
      const params = {
        page: page + 1, // API пагинациясы 1-ден басталады
        limit: rowsPerPage
      };
      
      // Іздеу сұранысын қосу
      if (search) {
        params.search = search;
      }
      
      // Фильтрлерді қосу
      if (filter.category) {
        params.categoryId = filter.category;
      }
      
      if (filter.language) {
        params.language = filter.language;
      }
      
      if (filter.availability) {
        params.available = filter.availability === 'available';
      }
      
      const response = await bookService.getBooks(params);
      
      if (response.success) {
        setBooks(response.data || []);
        setTotalBooks(response.total || 0);
      } else {
        setError(response.message || 'Кітаптар тізімін жүктеу кезінде қате орын алды');
        showSnackbar('Кітаптар тізімін жүктеу кезінде қате орын алды', 'error');
      }
    } catch (err) {
      console.error('Кітаптарды жүктеу қатесі:', err);
      setError('Кітаптар тізімін жүктеу кезінде қате орын алды');
      showSnackbar('Кітаптар тізімін жүктеу кезінде қате орын алды', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Параметрлер өзгергенде кітаптарды жүктеу
  useEffect(() => {
    fetchBooks();
  }, [page, rowsPerPage, search, filter]);
  
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
  
  // Беттеу өзгерісін өңдеу
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Бетте көрсетілетін жолдар санын өзгерту
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Іздеу өрісінің өзгерісін өңдеу
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Іздеу өзгергенде бірінші бетке оралу
  };
  
  // Фильтр өзгерісін өңдеу
  const handleFilterChange = (name, value) => {
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0); // Фильтр өзгергенде бірінші бетке оралу
  };
  
  // Кітап жою диалогын көрсету
  const handleShowDeleteDialog = (bookId) => {
    setSelectedBookId(bookId);
    setOpenDeleteDialog(true);
  };
  
  // Кітап жою диалогын жабу
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBookId(null);
  };
  
  // Кітапты жою
  const handleDeleteBook = async () => {
    try {
      setDeleteLoading(true);
      
      const response = await bookService.deleteBook(selectedBookId);
      
      if (response.success) {
        showSnackbar('Кітап сәтті жойылды', 'success');
        fetchBooks(); // Тізімді жаңарту
      } else {
        showSnackbar(response.message || 'Кітапты жою кезінде қате орын алды', 'error');
      }
    } catch (err) {
      console.error('Кітапты жою қатесі:', err);
      showSnackbar('Кітапты жою кезінде қате орын алды', 'error');
    } finally {
      setDeleteLoading(false);
      setOpenDeleteDialog(false);
      setSelectedBookId(null);
    }
  };
  
  // Кітапты өңдеу бетіне өту
  const handleEditBook = (bookId) => {
    navigate(`/books/edit/${bookId}`);
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: { xs: 2, sm: 3 } }}>
        {/* Тақырып және кітап қосу батырмасы */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0,
        }}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="h1" 
            fontWeight="600"
          >
            Кітаптар
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/books/new')}
            sx={{
              px: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 2,
              borderRadius: 1,
              alignSelf: isMobile ? 'stretch' : 'auto'
            }}
          >
            Жаңа кітап қосу
          </Button>
        </Box>
        
        {/* Қате хабарламасы */}
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
        
        {/* Іздеу және фильтрлер */}
        <BooksFilter 
          search={search}
          filter={filter}
          handleSearchChange={handleSearchChange}
          handleFilterChange={handleFilterChange}
        />
        
        {/* Кітаптар кестесі */}
        <BooksTable 
          books={books}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          totalBooks={totalBooks}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleEditBook={handleEditBook}
          handleDeleteBook={handleShowDeleteDialog}
          isMobile={isMobile}
        />
      </Box>
      
      {/* Жою диалогы */}
      <DeleteConfirmDialog 
        open={openDeleteDialog}
        loading={deleteLoading}
        onConfirm={handleDeleteBook}
        onCancel={handleCloseDeleteDialog}
      />
      
      {/* Хабарлама */}
      <CustomSnackbar 
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
        theme={theme}
      />
      
      {/* Жою кезінде жүктеу экраны */}
      <LoadingBackdrop 
        open={deleteLoading} 
        message="Кітап жойылуда..." 
      />
    </Container>
  );
};

export default BooksList;