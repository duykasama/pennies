export const ROUTES = {
  DASHBOARD: '/dashboard',
  EXPENSES: '/expenses',
  EXPENSES_ADD: '/expenses/add',
  AUTH_SIGN_UP: '/auth/sign-up',
  AUTH_SIGN_IN: '/auth/sign-in',
  AUTH_CHECK_EMAIL: '/auth/check-email',
  AUTH_VERIFIED: '/auth/verified',
  AUTH_VERIFY: '/auth/verify',
} as const

export const SORT = {
  DATE: 'date',
  AMOUNT: 'amount',
} as const

export type SortOption = (typeof SORT)[keyof typeof SORT]

export const FILTER = {
  ALL: 'all',
} as const
