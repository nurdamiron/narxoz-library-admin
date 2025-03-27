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

// Компонент статистической карточки
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

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeLoans: 0,
    overdueLoans: 0
  });
  const [recentLoans, setRecentLoans] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Имитация загрузки данных с сервера
    const fetchData = async () => {
      try {
        // В реальном приложении здесь будут запросы к API
        setTimeout(() => {
          setStats({
            totalBooks: 487,
            totalUsers: 254,
            activeLoans: 126,
            overdueLoans: 18
          });

          setRecentLoans([
            { id: 1, user: 'Асан Серіков', book: 'Қазақ әдебиетінің тарихы', borrowDate: '2023-05-15', dueDate: '2023-06-15', status: 'active' },
            { id: 2, user: 'Айгүл Қасымова', book: 'Экономика негіздері', borrowDate: '2023-05-10', dueDate: '2023-06-10', status: 'active' },
            { id: 3, user: 'Бауыржан Тоқтаров', book: 'Математикалық талдау', borrowDate: '2023-05-05', dueDate: '2023-06-05', status: 'overdue' },
            { id: 4, user: 'Дәмеш Ахметова', book: 'Қаржы менеджменті', borrowDate: '2023-05-02', dueDate: '2023-06-02', status: 'active' },
            { id: 5, user: 'Нұрлан Тастанов', book: 'Статистика', borrowDate: '2023-04-25', dueDate: '2023-05-25', status: 'overdue' }
          ]);

          // Данные для графика
          setChartData({
            labels: ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым'],
            datasets: [
              {
                label: 'Берілген кітаптар',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: theme.palette.primary.main,
                backgroundColor: 'rgba(213, 0, 50, 0.1)',
                tension: 0.3,
                fill: true
              }
            ]
          });

          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [theme]);

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
            title="Пайдаланушылар" 
            value={stats.totalUsers} 
            icon={<PeopleIcon />} 
            color={theme.palette.info}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Белсенді қарыздар" 
            value={stats.activeLoans} 
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
                    {recentLoans.map((loan) => (
                      <TableRow 
                        key={loan.id}
                        onClick={() => navigate(`/borrows/${loan.id}`)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                        }}
                      >
                        <TableCell>{loan.user}</TableCell>
                        <TableCell>{loan.book}</TableCell>
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
                                : 'success.light',
                              color: loan.status === 'overdue' 
                                ? 'error.dark' 
                                : 'success.dark',
                            }}
                          >
                            {loan.status === 'overdue' ? 'Мерзімі өткен' : 'Белсенді'}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
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