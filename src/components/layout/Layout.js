import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  MenuItem,
  Badge,
  Container,
  SwipeableDrawer,
  CssBaseline
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
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';

/**
 * Қосымшаның негізгі лейаут компоненті
 * 
 * @description Бұл компонент қосымша интерфейсінің негізгі құрылымын анықтайды,
 * оның ішінде аппбар, навигациялық сайдбар және басты мазмұн. Ол барлық қорғалған 
 * беттер үшін қолданылады. Мобильді және десктоп құрылғыларға бейімделген.
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
  
  // Медиа сұраныстар - мобильді құрылғыларды анықтау
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Күй айнымалылары
  const [mobileOpen, setMobileOpen] = useState(false); // Мобильді мәзірдің ашық/жабық күйі
  const [userMenuAnchor, setUserMenuAnchor] = useState(null); // Пайдаланушы мәзірінің якорі
  const [notificationsAnchor, setNotificationsAnchor] = useState(null); // Хабарландыру мәзірінің якорі
  const [unreadNotifications, setUnreadNotifications] = useState(2); // Оқылмаған хабарландырулар саны

  // Мобильді құрылғыларда беттің жүктелуі кезінде сайдбарды жабу
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile, location.pathname]);

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
   * Хабарландыру мәзірін ашу
   * @param {Event} event - Тінтуір оқиғасы
   */
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  /**
   * Хабарландыру мәзірін жабу
   */
  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
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
      {/* Логотип және атау - мобильді құрылғылар үшін жабу батырмасын қосу */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isMobile ? 'space-between' : 'center'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Нархоз Кітапхана
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} color="inherit">
            <ArrowBackIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      {/* Навигация элементтері */}
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
      {/* Жүйеден шығу батырмасы */}
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
      <CssBaseline />
      {/* Жоғарғы панель */}
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'black'
      }}>
        <Toolbar>
          {/* Мобильді мәзір батырмасы */}
          <IconButton
            color="inherit"
            aria-label="мәзірді ашу"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Мобильді көрініс үшін логотип */}
          {isMobile && (
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 'bold',
                color: theme.palette.primary.main 
              }}
            >
              Нархоз
            </Typography>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Хабарландырулар */}
          {/* <IconButton 
            color="inherit" 
            onClick={handleNotificationsOpen}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={unreadNotifications} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
          
          {/* Пайдаланушы мәзірі */}
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
            {/* Мобильді емес құрылғыларда пайдаланушы атын көрсету */}
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
            {/* <MenuItem onClick={() => {
              handleUserMenuClose();
              navigate('/profile');
            }}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Менің профилім
            </MenuItem> */}
            {/* <MenuItem onClick={() => {
              handleUserMenuClose();
              navigate('/settings');
            }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Параметрлер
            </MenuItem> */}
            {/* <Divider /> */}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Шығу
            </MenuItem>
          </Menu>
          
          {/* Хабарландырулар мәзірі */}
          <Menu
            anchorEl={notificationsAnchor}
            open={Boolean(notificationsAnchor)}
            onClose={handleNotificationsClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { width: 320, maxHeight: 400 }
            }}
          >
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Хабарландырулар
              </Typography>
            </Box>
            
            {/* Хабарландырулар тізімі - нақты деректермен ауыстырыңыз */}
            <MenuItem onClick={handleNotificationsClose}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" fontWeight="medium">
                  Кітапхана жүйесіне қош келдіңіз
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Бүгін, 10:30
                </Typography>
              </Box>
            </MenuItem>
            
            <MenuItem onClick={handleNotificationsClose}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" fontWeight="medium">
                  5 мерзімі өткен қарыз табылды
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Кеше, 15:45
                </Typography>
              </Box>
            </MenuItem>
            
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => {
                  handleNotificationsClose();
                  navigate('/notifications');
                }}
              >
                Барлық хабарландыруларды көру
              </Typography>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Мобильді сайдбар - SwipeableDrawer тип қолдану */}
      {isMobile ? (
        <SwipeableDrawer
          variant="temporary"
          open={mobileOpen}
          onOpen={() => setMobileOpen(true)}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true, // Мобильді өнімділікті жақсарту
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`
            },
          }}
        >
          {drawer}
        </SwipeableDrawer>
      ) : (
        // Десктоп сайдбар - тұрақты көрсетілген
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              borderRight: `1px solid ${theme.palette.divider}`
            },
          }}
          open
        >
          <Toolbar /> {/* AppBar биіктігіне тең кеңістік */}
          {drawer}
        </Drawer>
      )}

      {/* Негізгі мазмұн */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar /> {/* AppBar биіктігіне тең кеңістік */}
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;