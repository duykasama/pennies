import { categoryColor } from '#/lib/categories'
import type { ApiCategory } from '#/lib/categories'

export interface Expense {
  id: string
  cat: number
  title: string
  sub: string
  amount: number
  date: string
  freq: number | null
  updatedAt: string
}

export type ExpenseCreate = Omit<Expense, 'updatedAt'>

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

export function isoCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

export function monthLabel(m: string, locale = 'en'): string {
  const [y, mo] = m.split('-')
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(+y, +mo - 1, 1))
}

export function monthShort(m: string, locale = 'en'): string {
  const [, mo] = m.split('-')
  return new Intl.DateTimeFormat(locale, { month: 'short' }).format(
    new Date(2000, +mo - 1, 1),
  )
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
  return expenses
    .filter((e) => expenseMonth(e) === month)
    .reduce((s, e) => s + e.amount, 0)
}

export function formatVndShort(n: number): string {
  const a = Math.abs(n)
  if (a >= 1_000_000)
    return (
      '₫' +
      (a / 1_000_000).toFixed(a % 1_000_000 === 0 ? 0 : 1).replace('.', ',') +
      'M'
    )
  if (a >= 1_000) return '₫' + Math.round(a / 1_000) + 'k'
  return '₫' + a
}

export interface MonthSeriesItem {
  key: string
  short: string
  total: number
  current: boolean
}

export function monthSeries(
  expenses: Expense[],
  currentMonthKey: string,
  locale = 'en',
  count = 6,
): MonthSeriesItem[] {
  const months: string[] = []
  let k = currentMonthKey
  for (let i = 0; i < count; i++) {
    months.unshift(k)
    k = getPrevMonth(k)
  }
  return months.map((m) => ({
    key: m,
    short: monthShort(m, locale),
    total: calcMonthTotal(expenses, m),
    current: m === currentMonthKey,
  }))
}

export function calcTopCategory(
  expenses: Expense[],
  month: string,
): { cat: number; amount: number } | null {
  const sums: Record<number, number> = {}
  for (const e of expenses.filter((ex) => expenseMonth(ex) === month)) {
    sums[e.cat] = (sums[e.cat] || 0) + e.amount
  }
  let best: { cat: number; amount: number } | null = null
  for (const [cat, amount] of Object.entries(sums)) {
    if (!best || amount < best.amount) best = { cat: Number(cat), amount }
  }
  return best
}

export function formatVnd(n: number): string {
  const abs = Math.abs(n)
  const formatted = '₫' + abs.toLocaleString('vi-VN')
  return n < 0 ? '-' + formatted : formatted
}

// ─── Period summary helpers ──────────────────────────────────────────────────

function pDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export interface PeriodSummary {
  today: number
  todayCount: number
  week: number
  weekCount: number
  weekDelta: number | null // % change vs last week; negative = spent less
  month: number
  monthCount: number
  monthKey: string // 'YYYY-MM'
  year: number
  yearCount: number
  yearMonths: number // distinct months with spend in current year
  yearNum: number
}

/**
 * Compute Today / This week (Mon–Sun) / This month / This year totals.
 * Uses the `date` field (ISO yyyy-mm-dd) of each expense.
 * `todayIso` defaults to the real today; pass a fixed date in tests.
 */
export function periodSummary(
  expenses: Expense[],
  todayIso?: string,
  opts?: {
    weekFreqIds?: ReadonlySet<number>
    todayFreqIds?: ReadonlySet<number>
  },
): PeriodSummary {
  const iso = todayIso ?? isoToday()
  const t = pDate(iso)
  const dow = (t.getDay() + 6) % 7 // Monday = 0
  const weekStart = new Date(t)
  weekStart.setDate(t.getDate() - dow)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  const lwStart = new Date(weekStart)
  lwStart.setDate(weekStart.getDate() - 7)
  const lwEnd = new Date(weekStart)
  lwEnd.setDate(weekStart.getDate() - 1)
  const y = t.getFullYear(),
    m = t.getMonth()

  const inRange = (dateStr: string, a: Date, b: Date) => {
    const d = pDate(dateStr)
    return d >= a && d <= b
  }
  const sum = (arr: Expense[]) => arr.reduce((s, e) => s + e.amount, 0)
  const isTodayFreq = (e: Expense) =>
    opts?.todayFreqIds === undefined || e.freq === null || opts.todayFreqIds.has(e.freq)
  const isWeekFreq = (e: Expense) =>
    opts?.weekFreqIds === undefined || e.freq === null || opts.weekFreqIds.has(e.freq)

  const todayE = expenses.filter(
    (e) => e.date.slice(0, 10) === iso && isTodayFreq(e),
  )
  const weekE = expenses.filter(
    (e) => inRange(e.date.slice(0, 10), weekStart, weekEnd) && isWeekFreq(e),
  )
  const lweekE = expenses.filter(
    (e) => inRange(e.date.slice(0, 10), lwStart, lwEnd) && isWeekFreq(e),
  )
  const monthE = expenses.filter((e) => {
    const d = pDate(e.date.slice(0, 10))
    return d.getFullYear() === y && d.getMonth() === m
  })
  const yearE = expenses.filter(
    (e) => pDate(e.date.slice(0, 10)).getFullYear() === y,
  )

  const pct = (cur: number, prev: number): number | null =>
    prev && prev !== 0
      ? Math.round(((Math.abs(cur) - Math.abs(prev)) / Math.abs(prev)) * 100)
      : null

  return {
    today: sum(todayE),
    todayCount: todayE.length,
    week: sum(weekE),
    weekCount: weekE.length,
    weekDelta: pct(sum(weekE), sum(lweekE)),
    month: sum(monthE),
    monthCount: monthE.length,
    monthKey: `${y}-${String(m + 1).padStart(2, '0')}`,
    year: sum(yearE),
    yearCount: yearE.length,
    yearMonths: new Set(yearE.map((e) => e.date.slice(0, 7))).size,
    yearNum: y,
  }
}

/**
 * Category rollup for a subset of expenses →
 * [{ cat, name, emoji, dot, amount, pct }] sorted by magnitude descending.
 * Looks up name/icon from the fetched `categories` list and derives the
 * dot color from `categoryColor` since colors aren't part of the API response.
 */
export interface CatBreakdownItem {
  cat: number
  name: string
  emoji: string
  dot: string
  amount: number
  pct: number
}

export function catBreakdown(
  expenses: Expense[],
  categories: ApiCategory[],
): CatBreakdownItem[] {
  const sums: Record<number, number> = {}
  for (const e of expenses) {
    sums[e.cat] = (sums[e.cat] || 0) + e.amount
  }
  const total = Object.values(sums).reduce((s, v) => s + v, 0) || 1
  const byId = new Map(categories.map((c) => [c.id, c]))
  return Object.entries(sums)
    .map(([catStr, amount]) => {
      const cat = Number(catStr)
      const c = byId.get(cat)
      return {
        cat,
        name: c?.name ?? String(cat),
        emoji: c?.icon ?? '·',
        dot: categoryColor(cat).dot,
        amount,
        pct: Math.abs(amount) / Math.abs(total),
      }
    })
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
}
