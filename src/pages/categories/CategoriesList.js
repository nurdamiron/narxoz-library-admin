import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Grid,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

const CategoriesList = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({ name: '', description: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [stats, setStats] = useState([]);
  
  // Загрузка категорий
  useEffect(() => {
    fetchCategories();
  }, []);

  // Имитация загрузки категорий с сервера
  const fetchCategories = () => {
    setLoading(true);
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      const dummyCategories = [
        { id: 1, name: 'Әдебиет', description: 'Көркем әдебиет және поэзия', booksCount: 42 },
        { id: 2, name: 'Экономика', description: 'Экономика және бизнес туралы кітаптар', booksCount: 38 },
        { id: 3, name: 'Математика', description: 'Математика және статистика', booksCount: 25 },
        { id: 4, name: 'Қаржы', description: 'Қаржы, банк ісі және инвестициялар', booksCount: 31 },
        { id: 5, name: 'Маркетинг', description: 'Маркетинг, жарнама және PR', booksCount: 27 },
        { id: 6, name: 'Информатика', description: 'Компьютер ғылымдары және бағдарламалау', booksCount: 35 },
        { id: 7, name: 'Бухгалтерия', description: 'Бухгалтерлік есеп және аудит', booksCount: 18 },
        { id: 8, name: 'Менеджмент', description: 'Басқару және ұйымдастыру', booksCount: 24 },
        { id: 9, name: 'Бизнес', description: 'Кәсіпкерлік және бизнес стратегиялары', booksCount: 29 },
        { id: 10, name: 'Саясаттану', description: 'Саясат, мемлекеттік басқару және халықаралық қатынастар', booksCount: 19 },
        { id: 11, name: 'Физика', description: 'Физика және жаратылыстану ғылымдары', booksCount: 22 }
      ];
      
      setCategories(dummyCategories);
      
      // Создание статистики для дашборда
      const totalBooks = dummyCategories.reduce((sum, cat) => sum + cat.booksCount, 0);
      const topCategories = [...dummyCategories]
        .sort((a, b) => b.booksCount - a.booksCount)
        .slice(0, 3);
      
      setStats([
        { title: 'Барлық категориялар', value: dummyCategories.length, color: theme.palette.primary.main },
        { title: 'Барлық кітаптар', value: totalBooks, color: theme.palette.info.main },
        { title: 'Ең танымал категория', value: topCategories[0]?.name, color: theme.palette.success.main }
      ]);
      
      setLoading(false);
    }, 1000);
  };

  // Открытие диалога добавления категории
  const handleOpenAddDialog = () => {
    setFormData({ name: '', description: '' });
    setFormErrors({ name: '', description: '' });
    setOpenAddDialog(true);
  };

  // Открытие диалога редактирования категории
  const handleOpenEditDialog = (category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setFormErrors({ name: '', description: '' });
    setOpenEditDialog(true);
  };

  // Открытие диалога удаления категории
  const handleOpenDeleteDialog = (category) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };

  // Закрытие всех диалогов
  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
  };

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Сброс ошибок при вводе
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Валидация формы
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Категория атауын енгізіңіз';
      isValid = false;
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      errors.name = 'Атау 2-50 таңба аралығында болуы керек';
      isValid = false;
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Сипаттама 500 таңбадан аспауы керек';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Добавление новой категории
  const handleAddCategory = () => {
    if (!validateForm()) {
      return;
    }

    setActionLoading(true);
    
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      const newCategory = {
        id: categories.length + 1,
        name: formData.name,
        description: formData.description,
        booksCount: 0
      };
      
      setCategories([...categories, newCategory]);
      setActionSuccess('Категория сәтті қосылды');
      setActionLoading(false);
      handleCloseDialogs();
      
      // Сброс сообщения об успехе через 3 секунды
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    }, 1000);
  };

  // Редактирование категории
  const handleEditCategory = () => {
    if (!validateForm()) {
      return;
    }

    setActionLoading(true);
    
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      const updatedCategories = categories.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...cat, name: formData.name, description: formData.description }
          : cat
      );
      
      setCategories(updatedCategories);
      setActionSuccess('Категория сәтті жаңартылды');
      setActionLoading(false);
      handleCloseDialogs();
      
      // Сброс сообщения об успехе через 3 секунды
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    }, 1000);
  };

  // Удаление категории
  const handleDeleteCategory = () => {
    setActionLoading(true);
    
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      // Проверка на наличие книг в категории
      if (selectedCategory.booksCount > 0) {
        setActionSuccess({
          severity: 'error',
          message: `Категорияда ${selectedCategory.booksCount} кітап бар. Алдымен кітаптарды басқа категорияларға ауыстырыңыз.`
        });
        setActionLoading(false);
        handleCloseDialogs();
      } else {
        setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
        setActionSuccess('Категория сәтті жойылды');
        setActionLoading(false);
        handleCloseDialogs();
      }
      
      // Сброс сообщения об успехе через 3 секунды
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    }, 1000);
  };

  return (
    <Box>
      {/* Заголовок и кнопка добавления */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="medium">
          Категориялар
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Категория қосу
        </Button>
      </Box>

      {/* Сообщение об успешном действии или ошибке */}
      {actionSuccess && (
        <Alert 
          severity={typeof actionSuccess === 'object' ? actionSuccess.severity : 'success'} 
          sx={{ mb: 3 }}
        >
          {typeof actionSuccess === 'object' ? actionSuccess.message : actionSuccess}
        </Alert>
      )}

      {/* Статистика */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'medium' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      p: 1.5, 
                      borderRadius: '50%',
                      bgcolor: `${stat.color}15`,
                      color: stat.color
                    }}
                  >
                    <CategoryIcon />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Таблица категорий */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Категория атауы</TableCell>
                <TableCell>Сипаттама</TableCell>
                <TableCell>Кітаптар саны</TableCell>
                <TableCell align="right">Әрекеттер</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    Категориялар табылмады
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {category.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{category.description || '-'}</TableCell>
                    <TableCell>{category.booksCount}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenEditDialog(category)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleOpenDeleteDialog(category)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Диалог добавления категории */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialogs}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Жаңа категория қосу</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Категория атауы"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Сипаттама"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            error={Boolean(formErrors.description)}
            helperText={formErrors.description}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialogs} disabled={actionLoading}>
            Бас тарту
          </Button>
          <Button 
            onClick={handleAddCategory} 
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            Қосу
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования категории */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseDialogs}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Категорияны өңдеу</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Категория атауы"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Сипаттама"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            error={Boolean(formErrors.description)}
            helperText={formErrors.description}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialogs} disabled={actionLoading}>
            Бас тарту
          </Button>
          <Button 
            onClick={handleEditCategory} 
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            Сақтау
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог удаления категории */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialogs}
      >
        <DialogTitle>Категорияны жою</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedCategory && selectedCategory.booksCount > 0 ? (
              <>
                <strong>{selectedCategory.name}</strong> категориясында {selectedCategory.booksCount} кітап бар. 
                Категорияны жою үшін алдымен барлық кітаптарды басқа категорияларға ауыстыру қажет.
              </>
            ) : (
              <>
                <strong>{selectedCategory?.name}</strong> категориясын жойғыңыз келе ме? 
                Бұл әрекетті кері қайтару мүмкін емес.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={actionLoading}>
            Бас тарту
          </Button>
          {selectedCategory && selectedCategory.booksCount === 0 && (
            <Button 
              onClick={handleDeleteCategory} 
              color="error"
              disabled={actionLoading}
              startIcon={actionLoading ? <CircularProgress size={20} /> : null}
            >
              Жою
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesList;