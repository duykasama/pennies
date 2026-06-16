export const ROUTES = {
  DASHBOARD: '/dashboard',
  EXPENSES: '/expenses',
  EXPENSES_ADD: '/expenses/add',
  ACCOUNT: '/account',
  ACCOUNT_EDIT: '/account/edit',
  ACCOUNT_PASSWORD: '/account/password',
  AUTH_SIGN_UP: '/auth/sign-up',
  AUTH_SIGN_IN: '/auth/sign-in',
  AUTH_CHECK_EMAIL: '/auth/check-email',
  AUTH_VERIFIED: '/auth/verified',
  AUTH_VERIFY: '/auth/verify',
  AUTH_VERIFY_EMAIL: '/auth/verify-email',
  AUTH_GOOGLE_CALLBACK: '/auth/o-auth/google',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
} as const

export const SORT = {
  DATE: 'date',
  AMOUNT: 'amount',
} as const

export type SortOption = (typeof SORT)[keyof typeof SORT]

export const FILTER = {
  ALL: 'all',
} as const

export const API_URL = process.env['API_URL']
