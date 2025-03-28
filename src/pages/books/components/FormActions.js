// src/pages/books/components/FormActions.js
import React from 'react';
import { Box, Button, Divider, CircularProgress } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const FormActions = ({ saving, navigate, isMobile }) => {
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column-reverse' : 'row',
        gap: 2
      }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/books')}
          disabled={saving}
          sx={{ 
            py: 1.5,
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 500
          }}
          fullWidth={isMobile}
          size={isMobile ? "large" : "medium"}
        >
          Бас тарту
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={saving}
          sx={{ 
            py: 1.5,
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 2
          }}
          fullWidth={isMobile}
          size={isMobile ? "large" : "medium"}
        >
          {saving ? 'Сақталуда...' : 'Сақтау'}
        </Button>
      </Box>
    </>
  );
};

export default FormActions;