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
import bookService from '../../services/bookService';

/**
 * Категориялар тізімі компоненті
 * 
 * @description Бұл компонент категорияларды басқаруға арналған интерфейсті көрсетеді.
 * Ол категорияларды көру, қосу, өңдеу және жою мүмкіндіктерін ұсынады.
 */
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
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState([]);
  
  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Получение списка категорий с сервера
   */
  const fetchCategories = async () => {
    setLoading(true);
    
    try {
      const response = await bookService.getCategories();
      
      if (response.success) {
        const categoriesData = response.data || [];
        setCategories(categoriesData);
        
        // Формирование статистики
        generateStats(categoriesData);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage({
        type: 'error',
        text: 'Категорияларды жүктеу кезінде қате орын алды'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Формирование статистики на основе данных о категориях
   */
  const generateStats = (categoriesData) => {
    // Общее количество книг
    const totalBooks = categoriesData.reduce((sum, cat) => sum + (cat.books?.length || 0), 0);
    
    // Нахождение самой популярной категории
    let topCategory = { name: '-', booksCount: 0 };
    
    categoriesData.forEach(cat => {
      const booksCount = cat.books?.length || 0;
      if (booksCount > topCategory.booksCount) {
        topCategory = { name: cat.name, booksCount };
      }
    });
    
    setStats([
      { title: 'Барлық категориялар', value: categoriesData.length, color: theme.palette.primary.main },
      { title: 'Барлық кітаптар', value: totalBooks, color: theme.palette.info.main },
      { title: 'Ең танымал категория', value: topCategory.name, color: theme.palette.success.main }
    ]);
  };

  /**
   * Открытие диалога добавления категории
   */
  const handleOpenAddDialog = () => {
    setFormData({ name: '', description: '' });
    setFormErrors({ name: '', description: '' });
    setOpenAddDialog(true);
  };

  /**
   * Открытие диалога редактирования категории
   */
  const handleOpenEditDialog = (category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setFormErrors({ name: '', description: '' });
    setOpenEditDialog(true);
  };

  /**
   * Открытие диалога удаления категории
   */
  const handleOpenDeleteDialog = (category) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };

  /**
   * Закрытие всех диалогов
   */
  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
  };

  /**
   * Обработчик изменения полей формы
   */
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

  /**
   * Валидация формы
   */
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

  /**
   * Добавление новой категории
   */
  const handleAddCategory = async () => {
    if (!validateForm()) {
      return;
    }

    setActionLoading(true);
    
    try {
      const response = await bookService.createCategory(formData);
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Категория сәтті қосылды'
        });
        
        // Обновление списка категорий
        await fetchCategories();
        handleCloseDialogs();
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setMessage({
        type: 'error',
        text: 'Категорияны қосу кезінде қате орын алды'
      });
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Редактирование категории
   */
  const handleEditCategory = async () => {
    if (!validateForm()) {
      return;
    }

    setActionLoading(true);
    
    try {
      const response = await bookService.updateCategory(selectedCategory.id, formData);
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Категория сәтті жаңартылды'
        });
        
        // Обновление списка категорий
        await fetchCategories();
        handleCloseDialogs();
      } else {
        throw new Error('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setMessage({
        type: 'error',
        text: 'Категорияны жаңарту кезінде қате орын алды'
      });
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Удаление категории
   */
  const handleDeleteCategory = async () => {
    setActionLoading(true);
    
    try {
      const response = await bookService.deleteCategory(selectedCategory.id);
      
      if (response.success) {
        setMessage({
          type: 'success',
          text: 'Категория сәтті жойылды'
        });
        
        // Обновление списка категорий
        await fetchCategories();
        handleCloseDialogs();
      } else {
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      
      // Проверка на ошибку при наличии книг в категории
      if (error.response && error.response.status === 400) {
        setMessage({
          type: 'error',
          text: `Категорияда кітаптар бар. Алдымен кітаптарды басқа категорияларға ауыстырыңыз.`
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Категорияны жою кезінде қате орын алды'
        });
      }
    } finally {
      setActionLoading(false);
    }
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
      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
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
                    <TableCell>{category.books?.length || 0}</TableCell>
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
            {selectedCategory && selectedCategory.books && selectedCategory.books.length > 0 ? (
              <>
                <strong>{selectedCategory.name}</strong> категориясында кітаптар бар. 
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
          {selectedCategory && (!selectedCategory.books || selectedCategory.books.length === 0) && (
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