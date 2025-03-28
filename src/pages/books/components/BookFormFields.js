// src/pages/books/components/BookFormFields.js
import React from 'react';
import { 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Tooltip,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

const BookFormFields = ({ 
  formData, 
  formErrors, 
  categories,
  languages,
  isEditMode,
  isMobile,
  handleChange
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Кітап атауы"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={Boolean(formErrors.title)}
          helperText={formErrors.title}
          required
          variant="outlined"
          placeholder="Кітап атауын енгізіңіз"
          InputLabelProps={{
            shrink: true,
          }}
          size={isMobile ? "small" : "medium"}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Автор"
          name="author"
          value={formData.author}
          onChange={handleChange}
          error={Boolean(formErrors.author)}
          helperText={formErrors.author}
          required
          variant="outlined"
          placeholder="Автор атын енгізіңіз"
          InputLabelProps={{
            shrink: true,
          }}
          size={isMobile ? "small" : "medium"}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl 
          fullWidth 
          error={Boolean(formErrors.categoryId)} 
          required
          size={isMobile ? "small" : "medium"}
        >
          <InputLabel id="category-label">Категория</InputLabel>
          <Select
            labelId="category-label"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            label="Категория"
            placeholder="Категорияны таңдаңыз"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id.toString()}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {formErrors.categoryId && (
            <FormHelperText>{formErrors.categoryId}</FormHelperText>
          )}
        </FormControl>
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Сипаттама"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={isMobile ? 3 : 4}
          error={Boolean(formErrors.description)}
          helperText={formErrors.description}
          required
          variant="outlined"
          placeholder="Кітап сипаттамасын енгізіңіз"
          InputLabelProps={{
            shrink: true,
          }}
          size={isMobile ? "small" : "medium"}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Жарияланған жыл"
          name="publicationYear"
          value={formData.publicationYear}
          onChange={handleChange}
          type="number"
          inputProps={{ min: 1000, max: new Date().getFullYear() }}
          error={Boolean(formErrors.publicationYear)}
          helperText={formErrors.publicationYear}
          required
          variant="outlined"
          placeholder="Жылды енгізіңіз"
          InputLabelProps={{
            shrink: true,
          }}
          size={isMobile ? "small" : "medium"}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl 
          fullWidth 
          error={Boolean(formErrors.language)} 
          required
          size={isMobile ? "small" : "medium"}
        >
          <InputLabel id="language-label">Тіл</InputLabel>
          <Select
            labelId="language-label"
            name="language"
            value={formData.language}
            onChange={handleChange}
            label="Тіл"
          >
            {languages.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {formErrors.language && (
            <FormHelperText>{formErrors.language}</FormHelperText>
          )}
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Даналар саны"
          name="totalCopies"
          value={formData.totalCopies}
          onChange={handleChange}
          type="number"
          inputProps={{ min: 1 }}
          error={Boolean(formErrors.totalCopies)}
          helperText={formErrors.totalCopies}
          required
          variant="outlined"
          placeholder="Даналар санын енгізіңіз"
          InputLabelProps={{
            shrink: true,
          }}
          size={isMobile ? "small" : "medium"}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Қол жетімді даналар"
          name="availableCopies"
          value={formData.availableCopies}
          onChange={handleChange}
          type="number"
          inputProps={{ 
            min: 0, 
            max: formData.totalCopies ? parseInt(formData.totalCopies, 10) : undefined 
          }}
          disabled={!isEditMode}
          variant="outlined"
          placeholder="Қол жетімді даналар санын енгізіңіз"
          InputLabelProps={{
            shrink: true,
          }}
          size={isMobile ? "small" : "medium"}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Қарызға алу ұзақтығы (күндер)"
          name="borrowDuration"
          value={formData.borrowDuration}
          onChange={handleChange}
          type="number"
          inputProps={{ min: 1 }}
          variant="outlined"
          placeholder="Күндер санын енгізіңіз"
          InputLabelProps={{
            shrink: true,
          }}
          size={isMobile ? "small" : "medium"}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="ISBN"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          error={Boolean(formErrors.isbn)}
          helperText={formErrors.isbn || (isEditMode ? 'ISBN нөмірін өзгертуге болады' : 'Автоматты түрде жасалды')}
          variant="outlined"
          placeholder="Мысалы: 978-36578-269-2"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            readOnly: !isEditMode,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="ISBN - бұл кітаптың халықаралық стандартты нөмірі. Формат: 978-XXXXX-XXX-X">
                  <IconButton edge="end" size="small" tabIndex={-1}>
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          size={isMobile ? "small" : "medium"}
        />
      </Grid>
    </Grid>
  );
};

export default BookFormFields;