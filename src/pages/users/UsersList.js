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
  Button, 
  Typography, 
  TextField, 
  InputAdornment, 
  Chip,
  Avatar,
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
  useTheme
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
import userService from '../../services/userService';
import authService from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

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

// Компонент для аватара пользователя
const UserAvatar = ({ name, avatar }) => {
  const theme = useTheme();
  
  return avatar ? (
    <Avatar src={avatar} alt={name} />
  ) : (
    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
      {getInitials(name)}
    </Avatar>
  );
};

/**
 * Пайдаланушылар тізімі компоненті
 * 
 * @description Бұл компонент жүйенің барлық пайдаланушыларын тізім түрінде көрсетеді
 * және оларды басқаруға мүмкіндік береді (іздеу, сүзу, құру, өңдеу, жою).
 */
const UsersList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, hasRole } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Загрузка данных с сервера
  useEffect(() => {
    // Immediately check for role access
    checkRoleAccess();
    
    // Call fetchUsers only if we have proper access
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'librarian')) {
      fetchUsers();
    }
  }, [page, rowsPerPage, search, roleFilter, currentUser]);

  /**
   * Check if current user has permission to access this page
   */
  const checkRoleAccess = () => {
    if (!currentUser) {
      console.error('No user data available to check roles');
      
      // Try to fix auth state by refreshing it
      authService.refreshAuthState();
      
      setMessage({
        type: 'warning',
        text: 'Пайдаланушы мәліметтері жүктелмеді. Жүйеге қайта кіріңіз.'
      });
      return false;
    }
    
    console.log('Current user role for access check:', currentUser.role);
    
    if (currentUser.role !== 'admin' && currentUser.role !== 'librarian') {
      setMessage({
        type: 'warning',
        text: 'Тек әкімші немесе кітапханашылар пайдаланушылар тізіміне қол жеткізе алады'
      });
      setUsers([]);
      setTotalUsers(0);
      setLoading(false);
      return false;
    }
    
    return true;
  };

  /**
   * Получение списка пользователей с фильтрацией и пагинацией
   */
  const fetchUsers = async () => {
    setLoading(true);
    
    try {
      // Additional validation of the user role
      if (!checkRoleAccess()) {
        return;
      }
      
      // Подготовка параметров запроса
      const params = {
        page: page + 1,
        limit: rowsPerPage
      };
      
      // Добавление параметров поиска и фильтрации
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      
      console.log('Fetching users with params:', params);
      
      // Запрос к API
      const response = await userService.getUsers(params);
      
      // Обработка успешного ответа
      if (response && response.success) {
        setUsers(response.data || []);
        setTotalUsers(response.total || 0);
      } else {
        console.error('API response is not successful:', response);
        throw new Error('API returned unsuccessfully');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      
      let errorMessage = 'Пайдаланушыларды жүктеу кезінде қате орын алды';
      
      // Определение конкретной ошибки для понятного сообщения пользователю
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = 'Тізімге қол жеткізу үшін рұқсат жоқ. Тек әкімшілер мен кітапханашыларға рұқсат етіледі.';
        } else if (error.response.status === 401) {
          errorMessage = 'Сеансыңыздың мерзімі аяқталды. Қайта кіріңіз.';
        }
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      });
      
      setUsers([]);
      setTotalUsers(0);
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
   * Обработчик поиска пользователей
   */
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Сброс пагинации при изменении поиска
  };

  /**
   * Обработчик фильтра по роли
   */
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(0); // Сброс пагинации при изменении фильтра
  };

  /**
   * Обработчики меню действий
   */
  const handleMenuOpen = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Обработчики диалога удаления
   */
  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  /**
   * Удаление пользователя
   */
  const confirmDelete = async () => {
    setDeleteLoading(true);
    
    try {
      const response = await userService.deleteUser(selectedUserId);
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Пайдаланушы сәтті жойылды'
        });
        
        // Обновление списка пользователей
        fetchUsers();
      } else {
        throw new Error('Delete operation failed');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage({
        type: 'error',
        text: 'Пайдаланушыны жою кезінде қате орын алды'
      });
    } finally {
      setDeleteLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  /**
   * Переход к редактированию пользователя
   */
  const handleEditClick = () => {
    handleMenuClose();
    navigate(`/users/edit/${selectedUserId}`);
  };

  /**
   * Перевод роли на казахский
   */
  const translateRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Әкімші';
      case 'librarian':
        return 'Кітапханашы';
      case 'user':
        return 'Оқырман';
      default:
        return role;
    }
  };

  /**
   * Получение цвета для чипа роли
   */
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'librarian':
        return 'success';
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

  // Manual admin role fix button
  const handleFixAdminRole = () => {
    authService.refreshAuthState();
    window.location.reload();
  };

  // If user doesn't have proper role, show appropriate message
  if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'librarian') {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Тек әкімші немесе кітапханашылар пайдаланушылар тізіміне қол жеткізе алады
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
        >
          Басты бетке оралу
        </Button>
      </Box>
    );
  }

  // Handle loading or missing user data
  if (!currentUser) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Пайдаланушы мәліметтері жүктелмеді
        </Alert>
        <Button 
          variant="contained" 
          onClick={handleFixAdminRole}
          sx={{ mr: 2 }}
        >
          Рөлді жөндеу
        </Button>
        <Button 
          variant="outlined"
          onClick={() => navigate('/login')}
        >
          Жүйеге кіру
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок и кнопка добавления */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="medium">
          Пайдаланушылар
        </Typography>
        <Box>
          {currentUser && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Ағымдағы рөл: {translateRole(currentUser.role)}
            </Typography>
          )}
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/users/new')}
          >
            Пайдаланушы қосу
          </Button>
        </Box>
      </Box>

      {/* Сообщение об успешном действии */}
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
              label="Іздеу (аты, email, ID бойынша)"
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
              <InputLabel id="role-filter-label">Рөл бойынша сүзу</InputLabel>
              <Select
                labelId="role-filter-label"
                value={roleFilter}
                label="Рөл бойынша сүзу"
                onChange={handleRoleFilterChange}
              >
                <MenuItem value="">Барлығы</MenuItem>
                <MenuItem value="admin">Әкімші</MenuItem>
                <MenuItem value="librarian">Кітапханашы</MenuItem>
                <MenuItem value="user">Оқырман</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Таблица пользователей */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Аты</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Факультет</TableCell>
                <TableCell>Рөл</TableCell>
                <TableCell align="right">Әрекеттер</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    Пайдаланушылар табылмады
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <UserAvatar name={user.name} avatar={user.avatar} />
                        <Typography sx={{ ml: 2 }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.studentId}</TableCell>
                    <TableCell>{user.faculty}</TableCell>
                    <TableCell>
                      <Chip 
                        label={translateRole(user.role)} 
                        color={getRoleColor(user.role)} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, user.id)}>
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
          count={totalUsers}
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
        <DialogTitle>Пайдаланушыны жою</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Бұл пайдаланушыны жойғыңыз келе ме? Бұл әрекетті кері қайтару мүмкін емес және пайдаланушының барлық деректері жойылады.
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

export default UsersList;