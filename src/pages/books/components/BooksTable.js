// src/pages/books/components/BooksTable.js
import React, { useState } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  CircularProgress,
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const BooksTable = ({ 
  books, 
  loading, 
  page, 
  rowsPerPage, 
  totalBooks, 
  handleChangePage, 
  handleChangeRowsPerPage, 
  handleEditBook, 
  handleDeleteBook,
  isMobile
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  
  // Әрекеттер менюін ашу
  const handleMenuOpen = (event, bookId) => {
    setAnchorEl(event.currentTarget);
    setSelectedBookId(bookId);
  };
  
  // Әрекеттер менюін жабу
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Кітапты өңдеу
  const onEditClick = () => {
    handleMenuClose();
    handleEditBook(selectedBookId);
  };
  
  // Кітапты жою
  const onDeleteClick = () => {
    handleMenuClose();
    handleDeleteBook(selectedBookId);
  };
  
  // Кітап тілін қазақшаға аудару
  const translateLanguage = (language) => {
    switch (language) {
      case 'Казахский':
        return 'Қазақ тілі';
      case 'Русский':
        return 'Орыс тілі';
      case 'Английский':
        return 'Ағылшын тілі';
      default:
        return language;
    }
  };
  
  return (
    <Paper sx={{ mt: 2 }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: 'background.neutral' }}>
            <TableRow>
              <TableCell>Аты</TableCell>
              <TableCell>Автор</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Жыл</TableCell>
              <TableCell>Тіл</TableCell>
              {!isMobile && <TableCell>Қолжетімді/Барлығы</TableCell>}
              <TableCell>Күй</TableCell>
              <TableCell align="right">Әрекеттер</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 7 : 8} align="center" sx={{ py: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" color="text.secondary">
                      Деректер жүктелуде...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 7 : 8} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    Кітаптар табылмады
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {book.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category?.name || ''}</TableCell>
                  <TableCell>{book.publicationYear}</TableCell>
                  <TableCell>{translateLanguage(book.language)}</TableCell>
                  {!isMobile && (
                    <TableCell>{`${book.availableCopies} / ${book.totalCopies}`}</TableCell>
                  )}
                  <TableCell>
                    <Chip 
                      label={book.availableCopies > 0 ? "Қол жетімді" : "Қол жетімді емес"} 
                      color={book.availableCopies > 0 ? "success" : "error"} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {isMobile ? (
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuOpen(e, book.id)}
                        aria-label="Әрекеттер"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Өңдеу">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditBook(book.id)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Жою">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Беттеу */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalBooks}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Жолдар:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
      />
      
      {/* Әрекеттер менюі (мобильді көрініс үшін) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={onEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Өңдеу
        </MenuItem>
        <MenuItem onClick={onDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Жою
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default BooksTable;