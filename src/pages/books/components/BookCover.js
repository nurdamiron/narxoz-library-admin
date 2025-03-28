// src/pages/books/components/BookCover.js
import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  IconButton, 
  Button 
} from '@mui/material';
import { 
  Upload as UploadIcon, 
  Delete as DeleteIcon, 
  Book as BookIcon 
} from '@mui/icons-material';

const BookCover = ({ 
  coverPreview, 
  handleRemoveCover, 
  handleCoverChange, 
  theme, 
  isMobile 
}) => {
  return (
    <>
      <Typography variant="subtitle1" fontWeight="500" gutterBottom>
        Кітап мұқабасы
      </Typography>
      
      <Card
        sx={{
          width: '100%',
          height: { xs: 200, sm: 250, md: 300 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 2,
          position: 'relative',
          mb: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: theme.palette.primary.main,
          }
        }}
      >
        {coverPreview ? (
          <>
            <CardMedia
              component="img"
              image={coverPreview}
              alt="Кітап мұқабасы"
              sx={{ 
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                p: 2
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                bgcolor: 'background.paper',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'error.lighter',
                }
              }}
              onClick={handleRemoveCover}
              aria-label="Мұқабаны жою"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <BookIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary" fontWeight="500">
              Кітап мұқабасын жүктеу үшін түртіңіз
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
              PNG, JPG форматтары (макс. 5MB)
            </Typography>
          </Box>
        )}
      </Card>
      
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadIcon />}
        fullWidth
        sx={{ 
          py: 1.5,
          borderRadius: 1,
          textTransform: 'none',
          fontWeight: 500
        }}
        size={isMobile ? "small" : "medium"}
      >
        Мұқаба жүктеу
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleCoverChange}
        />
      </Button>
    </>
  );
};

export default BookCover;