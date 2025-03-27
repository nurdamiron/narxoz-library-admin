import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton, 
  Divider, 
  IconButton, 
  useMediaQuery, 
  useTheme, 
  Avatar, 
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Book as BookIcon,
  SwapHoriz as BorrowIcon,
  People as UserIcon,
  Category as CategoryIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * Қосымшаның негізгі лейаут компоненті
 * 
 * @description Бұл компонент қосымша интерфейсінің негізгі құрылымын анықтайды,
 * оның ішінде аппбар, навигациялық сайдбар және басты мазмұн. Ол барлық қорғалған 
 * беттер үшін қолданылады.
 */

// Сайдбар ені
const drawerWidth = 260;

// Навигация элементтері
const menuItems = [
  { title: 'Басты бет', path: '/', icon: <DashboardIcon /> },
  { title: 'Кітаптар', path: '/books', icon: <BookIcon /> },
  { title: 'Қарызға алулар', path: '/borrows', icon: <BorrowIcon /> },
  { title: 'Пайдаланушылар', path: '/users', icon: <UserIcon /> },
  { title: 'Категориялар', path: '/categories', icon: <CategoryIcon /> },
];

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  // Медиа сұраныстар
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Күй айнымалылары
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  /**
   * Мобильді мәзірді ашу/жабу
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /**
   * Пайдаланушы мәзірін ашу
   * @param {Event} event - Тінтуір оқиғасы
   */
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  /**
   * Пайдаланушы мәзірін жабу
   */
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  /**
   * Жүйеден шығу
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Пайдаланушы инициалдарын алу
   * @param {string} name - Пайдаланушы аты
   * @returns {string} - Инициалдар
   */
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Сайдбар мазмұны
  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Нархоз Кітапхана
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: `${theme.palette.primary.main}15`,
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}25`,
                  }
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? theme.palette.primary.main : 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Шығу" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Жоғарғы панель */}
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'black'
      }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleUserMenuOpen}
              color="inherit"
              edge="end"
            >
              {currentUser?.avatar ? (
                <Avatar 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                  {currentUser ? getInitials(currentUser.name) : 'U'}
                </Avatar>
              )}
            </IconButton>
            <Typography variant="body1" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              {currentUser?.name || 'Пайдаланушы'}
            </Typography>
          </Box>
          
          {/* Пайдаланушы мәзірі */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => {
              handleUserMenuClose();
              navigate('/profile');
            }}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Менің профилім
            </MenuItem>
            <MenuItem onClick={() => {
              handleUserMenuClose();
              navigate('/settings');
            }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Параметрлер
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Шығу
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Мобильді сайдбар */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Десктоп сайдбар */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Негізгі мазмұн */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3, 
        width: { md: `calc(100% - ${drawerWidth}px)` }, 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        marginTop: '64px'
      }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;