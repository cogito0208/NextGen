export const APP_CONFIG = {
  name: 'NextGen',
  description: 'Enterprise SaaS Platform',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  version: '0.1.0',
} as const;

export const PLANS = {
  free: {
    name: 'Free',
    maxUsers: 5,
    maxProjects: 3,
    price: 0,
  },
  starter: {
    name: 'Starter',
    maxUsers: 25,
    maxProjects: 10,
    price: 29,
  },
  professional: {
    name: 'Professional',
    maxUsers: 100,
    maxProjects: 50,
    price: 99,
  },
  enterprise: {
    name: 'Enterprise',
    maxUsers: Infinity,
    maxProjects: Infinity,
    price: -1, // Custom pricing
  },
} as const;

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  settings: '/settings',
  users: '/users',
} as const;
