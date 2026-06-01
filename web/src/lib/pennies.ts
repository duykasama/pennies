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
  updatedAt: string
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

export const CATEGORY_TO_API: Record<string, number> = {
  food: 1,
  transport: 2,
  shopping: 3,
  fun: 4,
  health: 5,
  util: 6,
  housing: 7,
  other: 8,
}

export const CATEGORY_FROM_API: Record<number, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_API).map(([k, v]) => [v, k]),
)

export function isoToday(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isoStartOfWeek(): string {
  const d = new Date()
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return d.toISOString().slice(0, 10)
}

export function isoStartOfMonth(): string {
  const d = new Date()
  d.setDate(1)
  return d.toISOString().slice(0, 10)
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export function isoCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

export function monthLabel(m: string): string {
  const [y, mo] = m.split('-')
  return `${MONTH_NAMES[+mo - 1]} ${y}`
}

export function monthShort(m: string): string {
  const [, mo] = m.split('-')
  return MONTH_NAMES[+mo - 1].slice(0, 3)
}

export function daysInMonth(m: string): number {
  const [y, mo] = m.split('-').map(Number)
  return new Date(y, mo, 0).getDate()
}

export function daysElapsed(m: string): number {
  const today = new Date()
  const currentMonth = today.toISOString().slice(0, 7)
  if (m > currentMonth) return 1
  if (m === currentMonth) return today.getDate()
  return daysInMonth(m)
}

export function getPrevMonth(m: string): string {
  const [y, mo] = m.split('-').map(Number)
  return mo === 1 ? `${y - 1}-12` : `${y}-${String(mo - 1).padStart(2, '0')}`
}

export function expenseMonth(e: Expense): string {
  return e.date.slice(0, 7)
}

export function getAvailableMonths(expenses: Expense[]): string[] {
  const set = new Set(expenses.map(expenseMonth))
  set.add(isoCurrentMonth())
  return [...set].sort()
}

export function calcMonthTotal(expenses: Expense[], month: string): number {
  return expenses.filter((e) => expenseMonth(e) === month).reduce((s, e) => s + e.amount, 0)
}

export function calcTopCategory(
  expenses: Expense[],
  month: string,
): { cat: string; amount: number } | null {
  const sums: Record<string, number> = {}
  for (const e of expenses.filter((ex) => expenseMonth(ex) === month)) {
    sums[e.cat] = (sums[e.cat] || 0) + e.amount
  }
  let best: { cat: string; amount: number } | null = null
  for (const [cat, amount] of Object.entries(sums)) {
    if (!best || amount < best.amount) best = { cat, amount }
  }
  return best
}

export function formatVnd(n: number): string {
  const abs = Math.abs(n)
  const formatted = '₫' + abs.toLocaleString('vi-VN')
  return n < 0 ? '-' + formatted : formatted
}
