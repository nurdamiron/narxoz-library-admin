import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Button, 
  Typography, 
  TextField, 
  InputAdornment, 
  IconButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import bookService from '../../services/bookService';

const BooksList = () => {
  const navigate = useNavigate();
  
  // Состояния
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [totalBooks, setTotalBooks] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Функция загрузки книг с сервера
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Подготовка параметров запроса
      const params = {
        page: page + 1, // Серверная пагинация может начинаться с 1
        limit: rowsPerPage
      };
      
      // Добавляем поисковый запрос, если он есть
      if (search) {
        params.search = search;
      }
      
      const response = await bookService.getBooks(params);
      
      if (response.success) {
        setBooks(response.data || []);
        setTotalBooks(response.total || 0);
      } else {
        setError(response.message || 'Не удалось загрузить список книг');
      }
    } catch (err) {
      console.error('Ошибка при загрузке книг:', err);
      setError('Произошла ошибка при загрузке книг. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при изменении параметров (страница, количество на странице, поиск)
  useEffect(() => {
    fetchBooks();
  }, [page, rowsPerPage, search]);

  // Обработчики пагинации
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Обработчик изменения поиска
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Сбрасываем на первую страницу при изменении поиска
  };

  // Обработка действий над книгами
  const handleMenuOpen = (event, bookId) => {
    setAnchorEl(event.currentTarget);
    setSelectedBookId(bookId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  // Подтверждение удаления книги
  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await bookService.deleteBook(selectedBookId);
      
      if (response.success) {
        // Перезагружаем список книг после успешного удаления
        await fetchBooks();
      } else {
        setError(response.message || 'Ошибка при удалении книги');
      }
    } catch (err) {
      console.error('Ошибка при удалении книги:', err);
      setError('Произошла ошибка при удалении книги');
    } finally {
      setDeleteLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  // Переход к редактированию книги
  const handleEditClick = () => {
    handleMenuClose();
    navigate(`/books/edit/${selectedBookId}`);
  };

  return (
    <Box>
      {/* Заголовок и кнопка добавления */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="medium">
          Кітаптар
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/books/new')}
        >
          Кітап қосу
        </Button>
      </Box>

      {/* Сообщение об ошибке */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Панель поиска и фильтров */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Іздеу"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
          >
            Сүзгілеу
          </Button>
        </Box>
      </Paper>

      {/* Таблица книг */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Аты</TableCell>
                <TableCell>Автор</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Жыл</TableCell>
                <TableCell>Тіл</TableCell>
                <TableCell>Қол жетімді / Барлығы</TableCell>
                <TableCell>Күй</TableCell>
                <TableCell align="right">Әрекеттер</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    Кітаптар табылмады
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow key={book.id} hover>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.category?.name || ''}</TableCell>
                    <TableCell>{book.publicationYear}</TableCell>
                    <TableCell>
                      {book.language === 'Казахский' ? 'Қазақ тілі' : 
                       book.language === 'Русский' ? 'Орыс тілі' : 
                       book.language === 'Английский' ? 'Ағылшын тілі' : book.language}
                    </TableCell>
                    <TableCell>{`${book.availableCopies} / ${book.totalCopies}`}</TableCell>
                    <TableCell>
                      <Chip 
                        label={book.availableCopies > 0 ? "Қол жетімді" : "Қол жетімді емес"} 
                        color={book.availableCopies > 0 ? "success" : "error"} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, book.id)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Пагинация */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalBooks}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Жолдар:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </Paper>

      {/* Меню действий */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Өңдеу
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Жою
        </MenuItem>
      </Menu>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Кітапты жою</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Бұл кітапты жойғыңыз келе ме? Бұл әрекетті кері қайтару мүмкін емес.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={deleteLoading}>
            Бас тарту
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            Жою
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BooksList;