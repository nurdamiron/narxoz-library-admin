// src/components/common/CustomSnackbar.js
import React from 'react';
import { Snackbar, SnackbarContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const CustomSnackbar = ({ open, message, severity, onClose, theme, autoHideDuration = 6000 }) => {
  // Хабарламаның түріне байланысты түсті анықтау
  const getBackgroundColor = () => {
    switch (severity) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ 
        vertical: 'bottom', 
        horizontal: 'center' 
      }}
    >
      <SnackbarContent
        sx={{
          backgroundColor: getBackgroundColor(),
        }}
        message={message}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Snackbar>
  );
};

export default CustomSnackbar;