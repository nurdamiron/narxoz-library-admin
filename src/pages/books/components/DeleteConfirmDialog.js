// src/pages/books/components/DeleteConfirmDialog.js
import React from 'react';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button, 
  CircularProgress,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material';

const DeleteConfirmDialog = ({ open, loading, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" />
          <Typography variant="h6">Кітапты жою</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography>
              Бұл кітапты жойғыңыз келе ме? Бұл әрекетті кері қайтару мүмкін емес.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              bgcolor: 'warning.lighter', 
              p: 1.5, 
              borderRadius: 1
            }}>
              <WarningIcon color="warning" />
              <Typography variant="body2" color="warning.dark">
                Егер бұл кітап пайдаланушыларға қарызға берілген болса, барлық қарызға алу деректері жоғалады.
              </Typography>
            </Box>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onCancel} 
          disabled={loading}
          variant="outlined"
          sx={{ textTransform: 'none' }}
        >
          Бас тарту
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          sx={{ 
            textTransform: 'none',
            boxShadow: 2 
          }}
        >
          {loading ? 'Жойылуда...' : 'Жою'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;