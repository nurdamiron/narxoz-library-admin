import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import BooksList from './pages/books/BooksList';
import BooksForm from './pages/books/BooksForm';
import BorrowsList from './pages/borrows/BorrowsList';
import BorrowDetails from './pages/borrows/BorrowDetails';
import UsersList from './pages/users/UsersList';
import UserForm from './pages/users/UserForm';
import CategoriesList from './pages/categories/CategoriesList';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Создание темы с основным цветом #d50032 (красный Нархоза)
const theme = createTheme({
  palette: {
    primary: {
      main: '#d50032',
      light: '#ff5c60',
      dark: '#9b0000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#424242',
      light: '#6d6d6d',
      dark: '#1b1b1b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Функция проверки авторизации (заглушка - будет заменена на настоящую)
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Защищенный маршрут - если пользователь не авторизован, перенаправляет на страницу входа
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="books" element={<BooksList />} />
            <Route path="books/new" element={<BooksForm />} />
            <Route path="books/edit/:id" element={<BooksForm />} />
            <Route path="borrows" element={<BorrowsList />} />
            <Route path="borrows/:id" element={<BorrowDetails />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/edit/:id" element={<UserForm />} />
            <Route path="categories" element={<CategoriesList />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;