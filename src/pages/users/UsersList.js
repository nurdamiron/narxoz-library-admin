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

const UsersList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
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
  const [actionSuccess, setActionSuccess] = useState(null);

  // Загрузка данных с сервера
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, search, roleFilter]);

  // Имитация загрузки пользователей с сервера
  const fetchUsers = () => {
    setLoading(true);
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      const dummyUsers = [
        { id: 1, name: 'Асан Серіков', email: 'asan.serikov@example.com', studentId: 'ST12345', faculty: 'Экономика факультеті', specialization: 'Қаржы', year: '3 курс', role: 'user', avatar: null },
        { id: 2, name: 'Айгүл Қасымова', email: 'aigul.kasymova@example.com', studentId: 'ST12346', faculty: 'Экономика факультеті', specialization: 'Маркетинг', year: '2 курс', role: 'user', avatar: null },
        { id: 3, name: 'Бауыржан Тоқтаров', email: 'bauyrzhan.toktarov@example.com', studentId: 'ST12347', faculty: 'IT факультеті', specialization: 'Информатика', year: '4 курс', role: 'user', avatar: null },
        { id: 4, name: 'Дәмеш Ахметова', email: 'damesh.akhmetova@example.com', studentId: 'ST12348', faculty: 'Экономика факультеті', specialization: 'Қаржы', year: '3 курс', role: 'user', avatar: null },
        { id: 5, name: 'Нұрлан Тастанов', email: 'nurlan.tastanov@example.com', studentId: 'ST12349', faculty: 'IT факультеті', specialization: 'Компьютерлік ғылымдар', year: '2 курс', role: 'user', avatar: null },
        { id: 6, name: 'Сәуле Тұрсынова', email: 'saule.tursynova@example.com', studentId: 'LB12345', faculty: 'Кітапханашы', specialization: 'Негізгі зал', year: 'N/A', role: 'librarian', avatar: null },
        { id: 7, name: 'Әкімші', email: 'admin@narxoz.kz', studentId: 'ADMIN-001', faculty: 'Әкімшілік', specialization: 'Кітапхана', year: 'N/A', role: 'admin', avatar: null }
      ];
      
      // Применение фильтров
      let filteredUsers = dummyUsers;
      
      // Фильтр по роли
      if (roleFilter) {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }
      
      // Фильтр по поиску
      if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(searchLower) || 
          user.email.toLowerCase().includes(searchLower) || 
          user.studentId.toLowerCase().includes(searchLower)
        );
      }
      
      // Пагинация
      const paginatedUsers = filteredUsers.slice(
        page * rowsPerPage, 
        page * rowsPerPage + rowsPerPage
      );
      
      setUsers(paginatedUsers);
      setTotalUsers(filteredUsers.length);
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

  // Обработчик изменения фильтра роли
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(0);
  };

  // Открытие меню действий
  const handleMenuOpen = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
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

  // Подтверждение удаления пользователя
  const confirmDelete = () => {
    setDeleteLoading(true);
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      setUsers(users.filter(user => user.id !== selectedUserId));
      setTotalUsers(totalUsers - 1);
      setDeleteLoading(false);
      setOpenDeleteDialog(false);
      setActionSuccess('Пайдаланушы сәтті жойылды');
      
      // Сброс сообщения об успехе через 3 секунды
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    }, 1000);
  };

  // Редактирование пользователя
  const handleEditClick = () => {
    handleMenuClose();
    navigate(`/users/edit/${selectedUserId}`);
  };

  // Перевод роли на казахский
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

  // Получение цвета для чипа роли
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

  return (
    <Box>
      {/* Заголовок и кнопка добавления */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="medium">
          Пайдаланушылар
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/users/new')}
        >
          Пайдаланушы қосу
        </Button>
      </Box>

      {/* Сообщение об успешном действии */}
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {actionSuccess}
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