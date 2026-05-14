export const ROUTES = {
  DASHBOARD: '/dashboard',
  EXPENSES: '/expenses',
  EXPENSES_ADD: '/expenses/add',
} as const

export const SORT = {
  DATE: 'date',
  AMOUNT: 'amount',
} as const

export type SortOption = (typeof SORT)[keyof typeof SORT]

export const FILTER = {
  ALL: 'all',
} as const
