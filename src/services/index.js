// src/services/index.js
/**
 * Барлық сервистерді экспорттау
 * 
 * Бұл файл сервистерді бір жерден импорттауға мүмкіндік береді
 */

import api from './api';
import authService from './authService';
import bookService from './bookService';
import userService from './userService';
import borrowService from './borrowService';
import crudService from './crudService';

// Админ сервистері
import adminBookService from './adminBookService';
import adminUserService from './adminUserService';
import adminBorrowService from './adminBorrowService';

export {
  // Негізгі сервистер
  api,
  authService,
  bookService,
  userService,
  borrowService,
  crudService,
  
  // Админ сервистері
  adminBookService,
  adminUserService,
  adminBorrowService
};