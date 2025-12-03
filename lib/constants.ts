// API Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// Route Constants
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SURVEYS: '/surveys',
  RESPONSES: '/responses',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

// Menu Items
export const MENU_ITEMS = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { name: 'Surveys', href: ROUTES.SURVEYS, icon: 'FileText' },
  { name: 'Responses', href: ROUTES.RESPONSES, icon: 'ClipboardList' },
  { name: 'Analytics', href: ROUTES.ANALYTICS, icon: 'BarChart3' },
] as const;

// Public Routes
export const PUBLIC_ROUTES = [
  ROUTES.SIGNIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  SURVEYS: {
    LIST: '/surveys',
    CREATE: '/surveys',
    GET: (id: string) => `/surveys/${id}`,
    UPDATE: (id: string) => `/surveys/${id}`,
    DELETE: (id: string) => `/surveys/${id}`,
  },
  RESPONSES: {
    LIST: '/responses',
    GET: (id: string) => `/responses/${id}`,
    CREATE: '/responses',
  },
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    SURVEY: (id: string) => `/analytics/survey/${id}`,
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

