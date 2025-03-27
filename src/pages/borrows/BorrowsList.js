import React, { useState, useEffect, useContext } from 'react';
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
  Typography,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Grid,
  useTheme,
  Avatar,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Book as BookIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  ExtensionOutlined as ExtendIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

// Функция для форматирования даты
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('kk-KZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Компонент для обложки книги
const BookCover = ({ book }) => {
  const theme = useTheme();
  
  return book?.cover ? (
    <Avatar variant="rounded" src={book.cover} alt={book.title} sx={{ width: 40, height: 60 }} />
  ) : (
    <Avatar variant="rounded" sx={{ width: 40, height: 60, bgcolor: theme.palette.primary.main }}>
      <BookIcon />
    </Avatar>
  );
};

// Компонент статуса займа
const BorrowStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'returned':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Белсенді';
      case 'returned':
        return 'Қайтарылған';
      case 'overdue':
        return 'Мерзімі өткен';
      default:
        return status;
    }
  };

  return (
    <Chip
      label={getStatusLabel(status)}
      color={getStatusColor(status)}
      size="small"
      variant="outlined"
      icon={status === 'returned' ? <CheckCircleIcon /> : status === 'overdue' ? <WarningIcon /> : <ScheduleIcon />}
    />
  );
};

/**
 * Қарызға алулар тізімі компоненті
 */
const BorrowsList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [borrows, setBorrows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [totalBorrows, setTotalBorrows] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBorrowId, setSelectedBorrowId] = useState(null);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Загрузка данных с сервера
  useEffect(() => {
    fetchBorrows();
  }, [page, rowsPerPage, search, statusFilter]);

  /**
   * Получение списка займов с фильтрацией и пагинацией
   */
  const fetchBorrows = async () => {
    setLoading(true);
    
    try {
      // Подготовка параметров запроса
      const params = {
        page: page + 1,
        limit: rowsPerPage
      };
      
      // Добавление параметров поиска и фильтрации
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      
      console.log('Fetching borrows with params:', params);
      
      // Запрос к API
      const response = await api.get('/borrows', { params });
      
      console.log('API response:', response);
      
      if (response && response.success) {
        setBorrows(response.data || []);
        setTotalBorrows(response.total || 0);
      } else {
        throw new Error('API returned unsuccessfully');
      }
    } catch (error) {
      console.error('Error fetching borrows:', error);
      
      let errorMessage = 'Қарызға алуларды жүктеу кезінде қате орын алды';
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = 'Қарызға алулар тізіміне қол жеткізу үшін рұқсат жоқ';
        } else if (error.response.status === 401) {
          errorMessage = 'Сеансыңыздың мерзімі аяқталды. Қайта кіріңіз';
        }
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      });
      
      setBorrows([]);
      setTotalBorrows(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обработчики пагинации
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * Обработчик поиска займов
   */
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  /**
   * Обработчик фильтра по статусу
   */
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  /**
   * Обработчики меню действий
   */
  const handleMenuOpen = (event, borrowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedBorrowId(borrowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Переход к детальной информации о займе
   */
  const handleViewDetails = (borrowId) => {
    handleMenuClose();
    navigate(`/borrows/${borrowId}`);
  };

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="medium">
          Қарызға алулар
        </Typography>
      </Box>

      {/* Сообщение */}
      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      {/* Панель поиска и фильтров */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Іздеу"
              variant="outlined"
              size="small"
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl size="small" fullWidth>
              <InputLabel id="status-filter-label">Мәртебе бойынша сүзу</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Мәртебе бойынша сүзу"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">Барлығы</MenuItem>
                <MenuItem value="active">Белсенді</MenuItem>
                <MenuItem value="returned">Қайтарылған</MenuItem>
                <MenuItem value="overdue">Мерзімі өткен</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Таблица займов */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Оқырман</TableCell>
                <TableCell>Кітап</TableCell>
                <TableCell>Алынған күн</TableCell>
                <TableCell>Қайтару мерзімі</TableCell>
                <TableCell>Мәртебе</TableCell>
                <TableCell align="right">Әрекеттер</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : borrows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    Қарызға алулар табылмады
                  </TableCell>
                </TableRow>
              ) : (
                borrows.map((borrow) => (
                  <TableRow key={borrow.id} hover>
                    <TableCell>{borrow.id}</TableCell>
                    <TableCell>
                      {borrow.user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 30, height: 30, mr: 1 }}>
                            {borrow.user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{borrow.user.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {borrow.user.email}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          ID: {borrow.userId}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {borrow.book ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BookCover book={borrow.book} />
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="body2">{borrow.book.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {borrow.book.author}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          ID: {borrow.bookId}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(borrow.borrowDate)}</TableCell>
                    <TableCell>{formatDate(borrow.dueDate)}</TableCell>
                    <TableCell>
                      <BorrowStatus status={borrow.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDetails(borrow.id)}
                      >
                        Толық көру
                      </Button>
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
          count={totalBorrows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Жолдар:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </Paper>
    </Box>
  );
};

export default BorrowsList;