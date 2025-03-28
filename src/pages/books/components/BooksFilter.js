// src/pages/books/components/BooksFilter.js
import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Box, 
  TextField, 
  InputAdornment, 
  Button, 
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Popover,
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import bookService from '../../../services/bookService';

const BooksFilter = ({ search, filter, handleSearchChange, handleFilterChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Категорияларды жүктеу
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await bookService.getCategories();
        if (response.success) {
          setCategories(response.data || []);
        }
      } catch (err) {
        console.error('Категорияларды жүктеу қатесі:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Фильтр менюін ашу
  const handleOpenFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Фильтр менюін жабу
  const handleCloseFilter = () => {
    setAnchorEl(null);
  };
  
  // Барлық фильтрлерді тазалау
  const handleClearFilters = () => {
    handleFilterChange('category', '');
    handleFilterChange('language', '');
    handleFilterChange('availability', '');
    handleCloseFilter();
  };
  
  // Фильтрдің белсенділігін тексеру
  const isFilterActive = filter.category || filter.language || filter.availability;
  
  // Қолданылған фильтрлер санын есептеу
  const getActiveFilterCount = () => {
    let count = 0;
    if (filter.category) count++;
    if (filter.language) count++;
    if (filter.availability) count++;
    return count;
  };
  
  // Активті фильтр чипын жасау
  const renderFilterChips = () => {
    const chips = [];
    
    if (filter.category) {
      const category = categories.find(c => c.id.toString() === filter.category.toString());
      chips.push(
        <Chip
          key="category"
          label={`Категория: ${category ? category.name : filter.category}`}
          onDelete={() => handleFilterChange('category', '')}
          size="small"
          sx={{ mr: 1, mb: isMobile ? 1 : 0 }}
        />
      );
    }
    
    if (filter.language) {
      const languages = {
        'Казахский': 'Қазақ тілі',
        'Русский': 'Орыс тілі',
        'Английский': 'Ағылшын тілі'
      };
      chips.push(
        <Chip
          key="language"
          label={`Тіл: ${languages[filter.language] || filter.language}`}
          onDelete={() => handleFilterChange('language', '')}
          size="small"
          sx={{ mr: 1, mb: isMobile ? 1 : 0 }}
        />
      );
    }
    
    if (filter.availability) {
      chips.push(
        <Chip
          key="availability"
          label={`Күй: ${filter.availability === 'available' ? 'Қол жетімді' : 'Қол жетімді емес'}`}
          onDelete={() => handleFilterChange('availability', '')}
          size="small"
          sx={{ mr: 1, mb: isMobile ? 1 : 0 }}
        />
      );
    }
    
    return chips;
  };
  
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: 2
      }}>
        {/* Іздеу өрісі */}
        <TextField
          fullWidth
          label="Іздеу"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          placeholder="Кітап атауы, автор немесе ISBN бойынша іздеу"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleSearchChange({ target: { value: '' } })}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        {/* Фильтр батырмасы */}
        <Button 
          variant={isFilterActive ? "contained" : "outlined"}
          startIcon={<FilterListIcon />}
          onClick={handleOpenFilter}
          sx={{ 
            minWidth: isMobile ? '100%' : '120px',
            whiteSpace: 'nowrap',
            textTransform: 'none',
            fontWeight: 500
          }}
          color={isFilterActive ? "primary" : "inherit"}
        >
          Сүзгі {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
        </Button>
      </Box>
      
      {/* Белсенді фильтрлер */}
      {isFilterActive && (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          mt: 2,
          alignItems: 'center'
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1, mb: isMobile ? 1 : 0 }}>
            Белсенді сүзгілер:
          </Typography>
          {renderFilterChips()}
          <Chip
            label="Барлығын тазалау"
            onClick={handleClearFilters}
            size="small"
            variant="outlined"
            icon={<ClearIcon fontSize="small" />}
            sx={{ mb: isMobile ? 1 : 0 }}
          />
        </Box>
      )}
      
      {/* Фильтр менюі */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseFilter}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { 
            p: 2,
            width: 300,
            maxWidth: '100%'
          }
        }}
      >
        <Typography variant="subtitle1" fontWeight="500" gutterBottom>
          Сүзгілер
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Категория фильтрі */}
          <FormControl fullWidth size="small">
            <InputLabel id="category-filter-label">Категория</InputLabel>
            <Select
              labelId="category-filter-label"
              value={filter.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              label="Категория"
            >
              <MenuItem value="">
                <em>Барлығы</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Тіл фильтрі */}
          <FormControl fullWidth size="small">
            <InputLabel id="language-filter-label">Тіл</InputLabel>
            <Select
              labelId="language-filter-label"
              value={filter.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              label="Тіл"
            >
              <MenuItem value="">
                <em>Барлығы</em>
              </MenuItem>
              <MenuItem value="Казахский">Қазақ тілі</MenuItem>
              <MenuItem value="Русский">Орыс тілі</MenuItem>
              <MenuItem value="Английский">Ағылшын тілі</MenuItem>
            </Select>
          </FormControl>
          
          {/* Қолжетімділік фильтрі */}
          <FormControl fullWidth size="small">
            <InputLabel id="availability-filter-label">Күй</InputLabel>
            <Select
              labelId="availability-filter-label"
              value={filter.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              label="Күй"
            >
              <MenuItem value="">
                <em>Барлығы</em>
              </MenuItem>
              <MenuItem value="available">Қол жетімді</MenuItem>
              <MenuItem value="unavailable">Қол жетімді емес</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small"
            onClick={handleClearFilters}
          >
            Тазалау
          </Button>
          <Button 
            variant="contained" 
            size="small"
            onClick={handleCloseFilter}
          >
            Қолдану
          </Button>
        </Box>
      </Popover>
    </Paper>
  );
};

export default BooksFilter;