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
  CircularProgress
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

const BooksList = () => {
  const navigate = useNavigate();
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

  // Загрузка данных с сервера
  useEffect(() => {
    fetchBooks();
  }, [page, rowsPerPage, search]);

  // Имитация загрузки книг с сервера
  const fetchBooks = () => {
    setLoading(true);
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      const dummyBooks = [
        { id: 1, title: 'Қазақ әдебиетінің тарихы', author: 'Мұхтар Әуезов', category: 'Әдебиет', year: 2018, language: 'Казахский', available: 5, total: 10 },
        { id: 2, title: 'Экономика негіздері', author: 'Нұрлан Оспанов', category: 'Экономика', year: 2020, language: 'Казахский', available: 3, total: 8 },
        { id: 3, title: 'Математикалық талдау', author: 'Асқар Жұмаділов', category: 'Математика', year: 2019, language: 'Казахский', available: 0, total: 5 },
        { id: 4, title: 'Қаржы менеджменті', author: 'Айнұр Қасымова', category: 'Қаржы', year: 2021, language: 'Казахский', available: 7, total: 7 },
        { id: 5, title: 'Статистика', author: 'Бауыржан Әлиев', category: 'Экономика', year: 2017, language: 'Казахский', available: 2, total: 6 },
        { id: 6, title: 'Маркетинг негіздері', author: 'Сәуле Тұрсынова', category: 'Маркетинг', year: 2022, language: 'Казахский', available: 4, total: 12 },
        { id: 7, title: 'Програмалау негіздері', author: 'Дастан Рахимов', category: 'Информатика', year: 2020, language: 'Казахский', available: 1, total: 3 },
        { id: 8, title: 'Бухгалтерлік есеп', author: 'Гүлнәр Серікова', category: 'Бухгалтерия', year: 2019, language: 'Казахский', available: 5, total: 9 },
        { id: 9, title: 'Менеджмент', author: 'Асхат Нұрланов', category: 'Менеджмент', year: 2021, language: 'Казахский', available: 6, total: 8 },
        { id: 10, title: 'Кәсіпкерлік негіздері', author: 'Мақсат Жексенбаев', category: 'Бизнес', year: 2018, language: 'Казахский', available: 0, total: 4 },
        { id: 11, title: 'Халықаралық қатынастар', author: 'Жанар Сәрсенова', category: 'Саясаттану', year: 2020, language: 'Казахский', available: 3, total: 7 },
        { id: 12, title: 'Физика курсы', author: 'Қайрат Әбілов', category: 'Физика', year: 2019, language: 'Казахский', available: 4, total: 6 }
      ];
      
      const filteredBooks = search 
        ? dummyBooks.filter(book => 
            book.title.toLowerCase().includes(search.toLowerCase()) || 
            book.author.toLowerCase().includes(search.toLowerCase())
          ) 
        : dummyBooks;
        
      const paginatedBooks = filteredBooks.slice(
        page * rowsPerPage, 
        page * rowsPerPage + rowsPerPage
      );
      
      setBooks(paginatedBooks);
      setTotalBooks(filteredBooks.length);
      setLoading(false);
    }, 1000);
  };

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
    setPage(0);
  };

  // Открытие меню действий
  const handleMenuOpen = (event, bookId) => {
    setAnchorEl(event.currentTarget);
    setSelectedBookId(bookId);
  };

  // Закрытие меню действий
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Открытие диалога подтверждения удаления
  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  // Закрытие диалога подтверждения удаления
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  // Подтверждение удаления книги
  const confirmDelete = () => {
    setDeleteLoading(true);
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      setBooks(books.filter(book => book.id !== selectedBookId));
      setTotalBooks(totalBooks - 1);
      setDeleteLoading(false);
      setOpenDeleteDialog(false);
    }, 1000);
  };

  // Редактирование книги
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
                    <TableCell>{book.category}</TableCell>
                    <TableCell>{book.year}</TableCell>
                    <TableCell>{book.language}</TableCell>
                    <TableCell>{`${book.available} / ${book.total}`}</TableCell>
                    <TableCell>
                      <Chip 
                        label={book.available > 0 ? "Қол жетімді" : "Қол жетімді емес"} 
                        color={book.available > 0 ? "success" : "error"} 
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