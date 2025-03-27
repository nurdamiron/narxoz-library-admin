import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Event as EventIcon,
  Person as PersonIcon,
  ExtensionOutlined as ExtendIcon,
  Notes as NotesIcon,
  LibraryBooks as LibraryBooksIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

// Функция для форматирования даты
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('kk-KZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Функция для расчета оставшихся дней
const calculateRemainingDays = (dueDate) => {
  if (!dueDate) return 0;
  
  const due = new Date(dueDate);
  const now = new Date();
  
  // Устанавливаем время на полночь для корректного сравнения дат
  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  // Вычисляем разницу в миллисекундах и конвертируем в дни
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Қарызға алу толық мәліметтері компоненті
 * 
 * @description Бұл компонент жеке қарызға алу туралы толық ақпаратты көрсетеді
 * және оны басқаруға мүмкіндік береді.
 */
const BorrowDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [borrow, setBorrow] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBorrowDetails();
  }, [id]);

  /**
   * Получение детальной информации о займе
   */
  const fetchBorrowDetails = async () => {
    setLoading(true);
    
    try {
      const response = await api.get(`/borrows/${id}`);
      
      if (response && response.success) {
        setBorrow(response.data);
      } else {
        throw new Error('Failed to fetch borrow details');
      }
    } catch (error) {
      console.error('Error fetching borrow details:', error);
      setMessage({
        type: 'error',
        text: 'Қарызға алу мәліметтерін жүктеу кезінде қате орын алды'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обработчики диалога возврата книги
   */
  const handleReturnBook = () => {
    setReturnDialogOpen(true);
  };

  const handleReturnDialogClose = () => {
    setReturnDialogOpen(false);
  };

  /**
   * Обработчики диалога продления займа
   */
  const handleExtendBorrow = () => {
    setExtendDialogOpen(true);
  };

  const handleExtendDialogClose = () => {
    setExtendDialogOpen(false);
  };

  /**
   * Возврат книги
   */
  const confirmReturn = async () => {
    setActionLoading(true);
    
    try {
      const response = await api.put(`/borrows/${id}/return`);
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Кітап сәтті қайтарылды'
        });
        
        // Обновление информации о займе
        fetchBorrowDetails();
      } else {
        throw new Error('Return operation failed');
      }
    } catch (error) {
      console.error('Error returning book:', error);
      setMessage({
        type: 'error',
        text: 'Кітапты қайтару кезінде қате орын алды'
      });
    } finally {
      setActionLoading(false);
      setReturnDialogOpen(false);
    }
  };

  /**
   * Продление займа
   */
  const confirmExtend = async () => {
    setActionLoading(true);
    
    try {
      const response = await api.put(`/borrows/${id}/extend`);
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Қарызға алу мерзімі сәтті ұзартылды'
        });
        
        // Обновление информации о займе
        fetchBorrowDetails();
      } else {
        throw new Error('Extend operation failed');
      }
    } catch (error) {
      console.error('Error extending borrow:', error);
      setMessage({
        type: 'error',
        text: 'Қарызға алу мерзімін ұзарту кезінде қате орын алды'
      });
    } finally {
      setActionLoading(false);
      setExtendDialogOpen(false);
    }
  };

  /**
   * Получение цвета индикатора статуса
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return theme.palette.primary.main;
      case 'returned':
        return theme.palette.success.main;
      case 'overdue':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  /**
   * Получение текста статуса
   */
  const getStatusText = (status) => {
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

  /**
   * Получение иконки статуса
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <ScheduleIcon />;
      case 'returned':
        return <CheckCircleIcon />;
      case 'overdue':
        return <WarningIcon />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!borrow) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/borrows')}
          sx={{ mb: 2 }}
        >
          Қарызға алулар тізіміне оралу
        </Button>
        
        <Alert severity="error">
          Қарызға алу мәліметтері табылмады немесе жүктеу кезінде қате орын алды
        </Alert>
      </Box>
    );
  }
  
  // Проверка доступа
  const canManageBorrow = currentUser && (
    currentUser.id === borrow.userId || 
    currentUser.role === 'admin' || 
    currentUser.role === 'librarian'
  );

  // Расчет оставшихся дней (если заем активен)
  const remainingDays = borrow.status === 'active' ? calculateRemainingDays(borrow.dueDate) : null;
  
  // Определение информации о статусе для активных займов
  let statusInfo = null;
  
  return (
    <Box>
      {/* Навигация назад */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/borrows')}
        sx={{ mb: 2 }}
      >
        Қарызға алулар тізіміне оралу
      </Button>
      
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
      
      {/* Главная информация */}
      <Grid container spacing={3}>
        {/* Основная информация о займе */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight="medium">
                Қарызға алу #{borrow.id}
              </Typography>
              <Chip 
                label={getStatusText(borrow.status)}
                color={borrow.status === 'active' ? 'primary' : borrow.status === 'returned' ? 'success' : 'error'}
                icon={getStatusIcon(borrow.status)}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Даты */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Алынған күн
                </Typography>
                <Typography variant="body1">
                  {formatDate(borrow.borrowDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Қайтару мерзімі
                </Typography>
                <Typography variant="body1">
                  {formatDate(borrow.dueDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Қайтарылған күн
                </Typography>
                <Typography variant="body1">
                  {borrow.returnDate ? formatDate(borrow.returnDate) : '-'}
                </Typography>
              </Grid>
            </Grid>
            
            {/* Статус индикатор (для активных займов) */}
            {borrow.status === 'active' && statusInfo && (
              <Alert severity={statusInfo.severity} sx={{ mb: 2 }}>
                {statusInfo.text}
              </Alert>
            )}
            
            {/* Заметки */}
            {borrow.notes && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <NotesIcon fontSize="small" sx={{ mr: 1 }} />
                  Ескертпелер
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: 'background.default' }}>
                  <Typography variant="body2">
                    {borrow.notes}
                  </Typography>
                </Paper>
              </Box>
            )}
            
            {/* Кнопки действий */}
            {borrow.status === 'active' && canManageBorrow && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleReturnBook}
                  disabled={actionLoading}
                >
                  Қайтару
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<ExtendIcon />}
                  onClick={handleExtendBorrow}
                  disabled={actionLoading || remainingDays < 0}
                >
                  Мерзімді ұзарту
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Информация о книге и пользователе */}
        <Grid item xs={12} md={4}>
          {/* Информация о книге */}
          {borrow.book && (
            <Card sx={{ mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                {borrow.book.cover ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={borrow.book.cover}
                    alt={borrow.book.title}
                    sx={{ objectFit: 'contain', bgcolor: 'background.default' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'background.default'
                    }}
                  >
                    <LibraryBooksIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
                  </Box>
                )}
              </Box>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Кітап
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {borrow.book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {borrow.book.author}
                </Typography>
                
                {borrow.book.category && (
                  <Chip 
                    label={borrow.book.category.name} 
                    size="small" 
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                )}
                
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    fullWidth
                    onClick={() => navigate(`/books/${borrow.bookId}`)}
                  >
                    Кітап туралы толық
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
          
          {/* Информация о пользователе */}
          {borrow.user && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 50, height: 50, mr: 2 }}>
                    {borrow.user.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Оқырман
                    </Typography>
                    <Typography variant="h6">
                      {borrow.user.name}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {borrow.user.email}
                  </Typography>
                  {borrow.user.studentId && (
                    <Typography variant="body2">
                      <strong>ID:</strong> {borrow.user.studentId}
                    </Typography>
                  )}
                </Stack>
                
                {(currentUser && currentUser.role === 'admin') && (
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      fullWidth
                      onClick={() => navigate(`/users/${borrow.userId}`)}
                    >
                      Оқырман профилі
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
      
      {/* Диалог подтверждения возврата книги */}
      <Dialog
        open={returnDialogOpen}
        onClose={handleReturnDialogClose}
      >
        <DialogTitle>Кітапты қайтару</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Бұл кітапты қайтарылды деп белгілегіңіз келе ме?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturnDialogClose} disabled={actionLoading}>
            Бас тарту
          </Button>
          <Button 
            onClick={confirmReturn} 
            color="primary" 
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            Қайтару
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Диалог подтверждения продления займа */}
      <Dialog
        open={extendDialogOpen}
        onClose={handleExtendDialogClose}
      >
        <DialogTitle>Қарызға алу мерзімін ұзарту</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Бұл қарызға алу мерзімін ұзартқыңыз келе ме?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExtendDialogClose} disabled={actionLoading}>
            Бас тарту
          </Button>
          <Button 
            onClick={confirmExtend} 
            color="primary" 
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            Ұзарту
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  if (borrow.status === 'active') {
    if (remainingDays > 0) {
      statusInfo = {
        text: `Қайтаруға ${remainingDays} күн қалды`,
        color: theme.palette.info.main,
        severity: 'info'
      };
    } else if (remainingDays === 0) {
      statusInfo = {
        text: 'Бүгін қайтару керек',
        color: theme.palette.warning.main,
        severity: 'warning'
      };
    } else {
      statusInfo = {
        text: `Мерзімі ${Math.abs(remainingDays)} күн бұрын өтті`,
        color: theme.palette.error.main,
        severity: 'error'
      };
    }
  }
};

export default BorrowDetail;