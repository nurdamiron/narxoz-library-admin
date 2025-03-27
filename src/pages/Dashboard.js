import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { 
  Book as BookIcon, 
  People as PeopleIcon, 
  SwapHoriz as BorrowIcon, 
  Warning as WarningIcon 
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import borrowService from '../services/borrowService';
import bookService from '../services/bookService';

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Статистикалық карточка компоненті
 * 
 * @param {Object} props - Компонент параметрлері
 * @param {string} props.title - Карточка тақырыбы
 * @param {string|number} props.value - Көрсетілетін мән
 * @param {React.ReactNode} props.icon - Карточка иконкасы
 * @param {string} props.color - Карточка түсі (theme түстерінде)
 * @returns {JSX.Element} - Статистикалық карточка компоненті
 */
const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'medium' }}>
              {value}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              p: 1.5, 
              borderRadius: '50%',
              bgcolor: `${color}.light`,
              color: `${color}.main`
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * Басты бет компоненті
 * 
 * @description Бұл компонент әкімші панелінің басты бетін көрсетеді және
 * кітапхана жүйесі туралы жалпы статистиканы ұсынады.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeLoans: 0,
    overdueLoans: 0
  });
  const [recentLoans, setRecentLoans] = useState([]);
  const [chartData, setChartData] = useState(null);

  // Данные загружаются при монтировании компонента
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Получение данных для дашборда
   */
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Загрузка статистики займов
      const statsResponse = await borrowService.getBorrowStats();
      
      if (statsResponse.success) {
        const { counts, mostBorrowedBooks, mostActiveBorrowers } = statsResponse.data;
        
        // Установка основной статистики
        setStats({
          totalBooks: counts.total || 0,
          activeLoans: counts.active || 0,
          overdueLoans: counts.overdue || 0,
          returnedLoans: counts.returned || 0
        });
        
        // Загрузка последних займов
        const borrowsResponse = await borrowService.getAllBorrows({
          limit: 5,
          page: 1
        });
        
        if (borrowsResponse.success) {
          setRecentLoans(borrowsResponse.data || []);
        }
        
        // Подготовка данных для графика
        // В реальном приложении здесь будут использоваться данные из API
        // Сейчас используем моковые данные
        const months = ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым'];
        const borrowData = [65, 59, 80, 81, 56, 55]; // Моковые данные
        
        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Берілген кітаптар',
              data: borrowData,
              borderColor: theme.palette.primary.main,
              backgroundColor: 'rgba(213, 0, 50, 0.1)',
              tension: 0.3,
              fill: true
            }
          ]
        });
      } else {
        throw new Error('Failed to fetch borrow stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Деректерді жүктеу кезінде қате орын алды. Кейінірек қайталап көріңіз.');
    } finally {
      setLoading(false);
    }
  };

  // Построение компонента
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="medium">
        Басты бет
      </Typography>

      {/* Сообщение об ошибке, если есть */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Статистические карточки */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Кітаптар" 
            value={stats.totalBooks} 
            icon={<BookIcon />} 
            color={theme.palette.primary}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Активті қарыздар" 
            value={stats.activeLoans} 
            icon={<BorrowIcon />} 
            color={theme.palette.info}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Қайтарылған" 
            value={stats.returnedLoans} 
            icon={<BorrowIcon />} 
            color={theme.palette.success}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Мерзімі өткен" 
            value={stats.overdueLoans} 
            icon={<WarningIcon />} 
            color={theme.palette.error}
          />
        </Grid>
      </Grid>

      {/* График и таблица */}
      <Grid container spacing={3}>
        {/* График кол-ва заимствований */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Берілген кітаптар статистикасы
              </Typography>
              {chartData && (
                <Box sx={{ height: 300 }}>
                  <Line 
                    data={chartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            drawBorder: false
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        }
                      }
                    }} 
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Недавние заимствования */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Соңғы қарыздар
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/borrows')}
                >
                  Барлығын көру
                </Button>
              </Box>
              
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Оқырман</TableCell>
                      <TableCell>Кітап</TableCell>
                      <TableCell>Мерзімі</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentLoans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          Қарыздар табылмады
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentLoans.map((loan) => (
                        <TableRow 
                          key={loan.id}
                          onClick={() => navigate(`/borrows/${loan.id}`)}
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                          }}
                        >
                          <TableCell>{loan.user?.name || '-'}</TableCell>
                          <TableCell>{loan.book?.title || '-'}</TableCell>
                          <TableCell>
                            <Box
                              component="span"
                              sx={{
                                py: 0.5,
                                px: 1.5,
                                borderRadius: 1,
                                fontSize: '0.75rem',
                                backgroundColor: loan.status === 'overdue' 
                                  ? 'error.light' 
                                  : loan.status === 'returned'
                                    ? 'success.light'
                                    : 'primary.light',
                                color: loan.status === 'overdue' 
                                  ? 'error.dark' 
                                  : loan.status === 'returned'
                                    ? 'success.dark'
                                    : 'primary.dark',
                              }}
                            >
                              {loan.status === 'overdue' 
                                ? 'Мерзімі өткен' 
                                : loan.status === 'returned'
                                  ? 'Қайтарылған'
                                  : 'Белсенді'}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;