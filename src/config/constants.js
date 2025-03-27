/**
 * Конфигурация константалары
 * 
 * @description Бұл файл бүкіл қосымшада қолданылатын константаларды анықтайды
 */

// API негізгі URL-і
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Пайдаланушы рөлдері
export const USER_ROLES = {
  ADMIN: 'admin',
  LIBRARIAN: 'librarian',
  USER: 'user'
};

// Қарызға алу мәртебелері
export const BORROW_STATUS = {
  ACTIVE: 'active',
  RETURNED: 'returned',
  OVERDUE: 'overdue'
};

// Кітап тілдері
export const BOOK_LANGUAGES = [
  { value: 'Казахский', label: 'Қазақ тілі' },
  { value: 'Русский', label: 'Орыс тілі' },
  { value: 'Английский', label: 'Ағылшын тілі' }
];

// Хабарландыру түрлері
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  RETURN: 'return',
  OVERDUE: 'overdue',
  SYSTEM: 'system'
};

// Пагинация параметрлері
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_ROWS_PER_PAGE: 10,
  ROWS_PER_PAGE_OPTIONS: [5, 10, 25, 50]
};

// Уақыт форматтары
export const DATE_FORMATS = {
  DISPLAY_DATE: 'dd.MM.yyyy',
  API_DATE: 'yyyy-MM-dd'
};

// Файл жүктеу шектеулері
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif']
};

// Проверка серверных ошибок
export const ERROR_MESSAGES = {
  DEFAULT: 'Қате орын алды. Әрекетті қайталап көріңіз.',
  UNAUTHORIZED: 'Сеансыңыздың мерзімі аяқталды. Қайта кіріңіз.',
  CONNECTION: 'Серверге қосылу мүмкін болмады. Интернет байланысын тексеріңіз.',
  VALIDATION: 'Деректерді тексеру қатесі. Енгізілген мәліметтерді тексеріңіз.'
};

// Оқиға статусы
export const EVENT_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Локалдық сақтау кілттері
export const STORAGE_KEYS = {
  AUTH_USERNAME: 'auth_username',
  AUTH_PASSWORD: 'auth_password', // Тек әзірлеу ортасында қолдану!
  AUTH_USER: 'auth_user',
  IS_AUTHENTICATED: 'isAuthenticated',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language'
};