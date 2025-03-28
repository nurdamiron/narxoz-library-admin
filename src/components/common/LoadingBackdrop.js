// src/components/common/LoadingBackdrop.js
import React from 'react';
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

const LoadingBackdrop = ({ open, message }) => {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(3px)'
      }}
      open={open}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 3,
        borderRadius: 2
      }}>
        <CircularProgress color="inherit" />
        {message && (
          <Typography variant="body1" color="inherit">
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
};

export default LoadingBackdrop;