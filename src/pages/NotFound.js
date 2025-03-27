import React from 'react';
import { Box, Typography, Button, Paper, useTheme } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        textAlign: 'center',
        p: 3
      }}
    >
      <Paper 
        sx={{ 
          p: 5, 
          borderRadius: 2, 
          maxWidth: 500, 
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center' 
        }}
      >
        <Typography 
          variant="h1" 
          component="h1" 
          color="primary" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '5rem', sm: '8rem' },
            mb: 2 
          }}
        >
          404
        </Typography>
        
        <Typography variant="h5" gutterBottom>
          Бет табылмады
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Сіз іздеген бет жоқ немесе жылжытылған. Басты бетке оралыңыз және қайтадан көріңіз.
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<HomeIcon />}
          size="large"
          onClick={() => navigate('/')}
        >
          Басты бетке оралу
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;