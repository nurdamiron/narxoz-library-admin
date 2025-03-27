import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Button, 
  Chip, 
  Divider, 
  IconButton, 
  Card, 
  CardContent, 
  CardMedia,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  TextField,
  useTheme
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Add as AddIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { format, formatDistance } from 'date-fns';
import { kk } from 'date-fns/locale';

// Функция для форматирования даты
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'dd.MM.yyyy');
  } catch (error) {
    return dateString;
  }
};

// Функция для вычисления прогресса заимствования (в процентах)
const calculateProgress = (borrowDate, dueDate) => {
  const start = new Date(borrowDate).getTime();
  const end = new Date(dueDate).getTime();
  const now = new Date().getTime();
  
  if (now >= end) return 100;
  if (now <= start) return 0;
  
  return Math.round(((now - start) / (end - start)) * 100);
};

// Функция для форматирования относительного времени
const formatRelativeTime = (dateString) => {
  try {
    return formatDistance(new Date(dateString), new Date(), { 
      addSuffix: true,
      locale: kk 
    });
  } catch (error) {
    return '';
  }
};

const BorrowDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [borrow, setBorrow] = useState(null);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [openExtendDialog, setOpenExtendDialog] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const [extendLoading, setExtendLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [notes, setNotes] = useState('');

  // Загрузка данных о заимствовании
  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      // Пример данных о заимствовании
      const borrowData = {
        id: parseInt(id),
        user: {
          id: 1,
          name: 'Асан Серіков',
          email: 'asan.serikov@example.com',
          studentId: 'ST12345',
          faculty: 'Экономика факультеті',
          specialization: 'Қаржы',
          year: '3 курс'
        },
        book: {
          id: 1,
          title: 'Қазақ әдебиетінің тарихы',
          author: 'Мұхтар Әуезов',
          category: 'Әдебиет',
          isbn: '9789965357528',
          cover: '/path/to/sample/cover.jpg'
        },
        borrowDate: '2023-05-15',
        dueDate: '2023-07-15',
        returnDate: null,
        status: 'active',
        notes: 'Кітап жақсы жағдайда берілді'
      };
      
      setBorrow(borrowData);
      setNotes(borrowData.notes || '');
      setLoading(false);
    }, 1500);
  }, [id]);

  // Обработчик возврата книги
  const handleReturn = () => {
    setReturnLoading(true);
    
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      setBorrow({
        ...borrow,
        status: 'returned',
        returnDate: new Date().toISOString().split('T')[0]
      });
      
      setReturnLoading(false);
      setOpenReturnDialog(false);
      setActionSuccess('Кітап сәтті қайтарылды');
      
      // Сброс сообщения об успехе через 3 секунды
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    }, 1500);
  };

  // Обработчик продления срока заимствования
  const handleExtend = () => {
    setExtendLoading(true);
    
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      // Продление на 14 дней
      const currentDueDate = new Date(borrow.dueDate);
      currentDueDate.setDate(currentDueDate.getDate() + 14);
      
      setBorrow({
        ...borrow,
        dueDate: currentDueDate.toISOString().split('T')[0]
      });
      
      setExtendLoading(false);
      setOpenExtendDialog(false);
      setActionSuccess('Қайтару мерзімі сәтті ұзартылды');
      
      // Сброс сообщения об успехе через 3 секунды
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    }, 1500);
  };

  // Обработчик сохранения примечаний
  const handleSaveNotes = () => {
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      setBorrow({
        ...borrow,
        notes: notes
      });
      
      setActionSuccess('Ескертпелер сәтті сақталды');
      
      // Сброс сообщения об успехе через 3 секунды
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    }, 500);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!borrow) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Қарызға алу табылмады
        </Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/borrows')}
          sx={{ mt: 2 }}
        >
          Тізімге оралу
        </Button>
      </Box>
    );
  }

  const isActive = borrow.status === 'active';
  const isOverdue = borrow.status === 'overdue';
  const isReturned = borrow.status === 'returned';
  const progress = calculateProgress(borrow.borrowDate, borrow.dueDate);
  const progressColor = isOverdue 
    ? theme.palette.error.main 
    : progress > 80 
      ? theme.palette.warning.main 
      : theme.palette.primary.main;

  return (
    <Box>
      {/* Заголовок и кнопка возврата в список */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          color="inherit" 
          onClick={() => navigate('/borrows')}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="medium">
          Қарызға алу мәліметтері
        </Typography>
      </Box>

      {/* Сообщение об успешном действии */}
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {actionSuccess}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Основная информация */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Негізгі ақпарат</Typography>
              <Box>
                {!isReturned && (
                  <>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => setOpenExtendDialog(true)}
                      startIcon={<CalendarTodayIcon />}
                      sx={{ mr: 1 }}
                    >
                      Мерзімді ұзарту
                    </Button>
                    <Button 
                      variant="contained" 
                      color="success"
                      onClick={() => setOpenReturnDialog(true)}
                      startIcon={<CheckCircleIcon />}
                    >
                      Қайтару
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Статус и прогресс */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  {isActive && (
                    <Chip 
                      icon={<AccessTimeIcon />}
                      label="Белсенді" 
                      color="primary" 
                      variant="outlined"
                    />
                  )}
                  {isOverdue && (
                    <Chip 
                      icon={<ScheduleIcon />}
                      label="Мерзімі өткен" 
                      color="error"
                      variant="outlined"
                    />
                  )}
                  {isReturned && (
                    <Chip 
                      icon={<CheckCircleIcon />}
                      label="Қайтарылған" 
                      color="success" 
                      variant="outlined"
                    />
                  )}
                </Grid>
                <Grid item xs>
                  {!isReturned && (
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                      <Box sx={{ width: '100%', mb: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{ 
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: progressColor
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {isOverdue 
                          ? `Мерзімінен ${formatRelativeTime(borrow.dueDate)} өтті` 
                          : `Қайтару мерзіміне ${formatRelativeTime(borrow.dueDate)} қалды`}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>

            {/* Детали заимствования */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Берілген күн
                </Typography>
                <Typography variant="body1">
                  {formatDate(borrow.borrowDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Қайтару мерзімі
                </Typography>
                <Typography variant="body1">
                  {formatDate(borrow.dueDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Қайтарылған күн
                </Typography>
                <Typography variant="body1">
                  {borrow.returnDate ? formatDate(borrow.returnDate) : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Күй
                </Typography>
                <Typography variant="body1">
                  {isActive ? 'Белсенді' : isOverdue ? 'Мерзімі өткен' : 'Қайтарылған'}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Примечания */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Ескертпелер
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                variant="outlined"
                placeholder="Қарызға алу туралы ескертпелер енгізіңіз"
                sx={{ mb: 2 }}
              />
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                onClick={handleSaveNotes}
              >
                Ескертпелерді сақтау
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Информация о книге и пользователе */}
        <Grid item xs={12} md={4}>
          {/* Информация о книге */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Кітап туралы
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row', md: 'column' },
                alignItems: { xs: 'center', sm: 'flex-start', md: 'center' },
                gap: 2 
              }}>
                <CardMedia
                  component="img"
                  image={borrow.book.cover || "https://via.placeholder.com/150x200"}
                  alt={borrow.book.title}
                  sx={{ 
                    width: { xs: '100%', sm: 150, md: '100%' },
                    maxWidth: { xs: 200, sm: 150, md: 200 },
                    mb: 2,
                    borderRadius: 1,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {borrow.book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {borrow.book.author}
                  </Typography>
                  <Chip size="small" label={borrow.book.category} sx={{ mb: 1 }} />
                  {borrow.book.isbn && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      ISBN: {borrow.book.isbn}
                    </Typography>
                  )}
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/books/edit/${borrow.book.id}`)}
                    sx={{ mt: 1 }}
                  >
                    Кітапты қарау
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Информация о пользователе */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Оқырман туралы
              </Typography>
              <Typography variant="subtitle1" fontWeight="medium">
                {borrow.user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {borrow.user.email}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Студент ID
                  </Typography>
                  <Typography variant="body2">
                    {borrow.user.studentId}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Курс/Жыл
                  </Typography>
                  <Typography variant="body2">
                    {borrow.user.year}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Факультет
                  </Typography>
                  <Typography variant="body2">
                    {borrow.user.faculty}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Мамандық
                  </Typography>
                  <Typography variant="body2">
                    {borrow.user.specialization}
                  </Typography>
                </Grid>
              </Grid>
              <Button 
                size="small" 
                onClick={() => navigate(`/users/edit/${borrow.user.id}`)}
                sx={{ mt: 2 }}
              >
                Пайдаланушыны қарау
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Диалог подтверждения возврата */}
      <Dialog
        open={openReturnDialog}
        onClose={() => setOpenReturnDialog(false)}
      >
        <DialogTitle>Кітапты қайтару</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{borrow.book.title}" кітабын қайтарылды деп белгілегіңіз келе ме?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenReturnDialog(false)} 
            disabled={returnLoading}
          >
            Бас тарту
          </Button>
          <Button 
            onClick={handleReturn} 
            color="success" 
            disabled={returnLoading}
            startIcon={returnLoading ? <CircularProgress size={20} /> : null}
          >
            Қайтарылды
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения продления */}
      <Dialog
        open={openExtendDialog}
        onClose={() => setOpenExtendDialog(false)}
      >
        <DialogTitle>Мерзімді ұзарту</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{borrow.book.title}" кітабының қайтару мерзімін 14 күнге ұзартқыңыз келе ме?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenExtendDialog(false)} 
            disabled={extendLoading}
          >
            Бас тарту
          </Button>
          <Button 
            onClick={handleExtend} 
            color="primary" 
            disabled={extendLoading}
            startIcon={extendLoading ? <CircularProgress size={20} /> : null}
          >
            Ұзарту
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BorrowDetails;