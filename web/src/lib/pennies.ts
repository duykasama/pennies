export interface Category {
  id: string
  label: string
  long: string
  emoji: string
  dot: string
  ink: string
}

export interface Expense {
  id: string
  cat: string
  title: string
  sub: string
  amount: number
  date: string
}

export const CATEGORIES: Category[] = [
  { id: 'food', label: 'Food', long: 'Food & Drink', emoji: '🍴', dot: 'var(--cat-food)', ink: 'var(--cat-food-ink)' },
  { id: 'transport', label: 'Transport', long: 'Transport', emoji: '🚌', dot: 'var(--cat-transport)', ink: 'var(--cat-transport-ink)' },
  { id: 'shopping', label: 'Shopping', long: 'Shopping', emoji: '🛍', dot: 'var(--cat-shopping)', ink: 'var(--cat-shopping-ink)' },
  { id: 'fun', label: 'Fun', long: 'Entertainment', emoji: '🎬', dot: 'var(--cat-entertain)', ink: 'var(--cat-entertain-ink)' },
  { id: 'health', label: 'Health', long: 'Health', emoji: '❤️', dot: 'var(--cat-health)', ink: 'var(--cat-health-ink)' },
  { id: 'util', label: 'Utilities', long: 'Utilities', emoji: '⚡', dot: 'var(--cat-utilities)', ink: 'var(--cat-utilities-ink)' },
  { id: 'housing', label: 'Housing', long: 'Housing', emoji: '🏠', dot: 'var(--cat-housing)', ink: 'var(--cat-housing-ink)' },
  { id: 'other', label: 'Other', long: 'Other', emoji: '···', dot: 'var(--cat-other)', ink: 'var(--cat-other-ink)' },
]

export const CAT_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

export const DATE_ORDER = ['today', 'yesterday', 'May 12', 'May 11', 'May 10']

export function formatVnd(n: number): string {
  const abs = Math.abs(n)
  const formatted = '₫' + abs.toLocaleString('vi-VN')
  return n < 0 ? '-' + formatted : formatted
}

export const SEED_EXPENSES: Expense[] = [
  { id: 'e1', cat: 'food', title: 'Food & Drink', sub: 'Lunch · pho place', amount: -65000, date: 'today' },
  { id: 'e2', cat: 'transport', title: 'Transport', sub: 'Grab to office', amount: -25000, date: 'today' },
  { id: 'e3', cat: 'shopping', title: 'Shopping', sub: 'Bookstore', amount: -320000, date: 'today' },
  { id: 'e4', cat: 'health', title: 'Health', sub: 'Pharmacy', amount: -85000, date: 'yesterday' },
  { id: 'e5', cat: 'fun', title: 'Entertainment', sub: 'Cinema · two seats', amount: -180000, date: 'yesterday' },
  { id: 'e6', cat: 'food', title: 'Food & Drink', sub: 'Coffee · banh mi', amount: -55000, date: 'May 12' },
  { id: 'e7', cat: 'util', title: 'Utilities', sub: 'Electric · May', amount: -420000, date: 'May 12' },
]
