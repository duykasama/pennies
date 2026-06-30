import { describe, it, expect } from 'vitest'
import {
  formatVnd,
  monthLabel,
  monthShort,
  daysInMonth,
  daysElapsed,
  getPrevMonth,
  expenseMonth,
  getAvailableMonths,
  calcMonthTotal,
  calcTopCategory,
  isoCurrentMonth,
  periodSummary,
} from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'

const mkExp = (
  overrides: Partial<Expense> & { id: string; date: string },
): Expense => ({
  cat: 1,
  title: 'Food',
  sub: '',
  amount: -10000,
  freq: 1,
  updatedAt: '',
  ...overrides,
})

describe('formatVnd', () => {
  it('formats a positive amount with ₫ prefix', () => {
    const result = formatVnd(65000)
    expect(result).toMatch(/^₫/)
    expect(result).toContain('65')
    expect(result).not.toContain('-')
  })

  it('formats a negative amount with -₫ prefix', () => {
    const result = formatVnd(-65000)
    expect(result).toMatch(/^-₫/)
    expect(result).toContain('65')
  })

  it('formats zero as ₫0', () => {
    expect(formatVnd(0)).toBe('₫0')
  })

  it('formats large amounts', () => {
    const result = formatVnd(1500000)
    expect(result).toMatch(/^₫/)
    expect(result).toContain('1')
    expect(result).toContain('5')
  })

  it('uses absolute value for negative input', () => {
    const pos = formatVnd(100000)
    const neg = formatVnd(-100000)
    expect(neg).toBe('-' + pos)
  })
})

describe('monthLabel', () => {
  it('formats May 2026', () => expect(monthLabel('2026-05')).toBe('May 2026'))
  it('formats January 2026', () =>
    expect(monthLabel('2026-01')).toBe('January 2026'))
  it('formats December 2025', () =>
    expect(monthLabel('2025-12')).toBe('December 2025'))
})

describe('monthShort', () => {
  it('shortens May to May', () => expect(monthShort('2026-05')).toBe('May'))
  it('shortens December to Dec', () =>
    expect(monthShort('2026-12')).toBe('Dec'))
})

describe('daysInMonth', () => {
  it('January has 31 days', () => expect(daysInMonth('2026-01')).toBe(31))
  it('non-leap February has 28 days', () =>
    expect(daysInMonth('2026-02')).toBe(28))
  it('leap-year February has 29 days', () =>
    expect(daysInMonth('2020-02')).toBe(29))
  it('April has 30 days', () => expect(daysInMonth('2026-04')).toBe(30))
})

describe('daysElapsed', () => {
  it('returns full days for a known past month', () =>
    expect(daysElapsed('2020-01')).toBe(31))
  it('returns 29 for leap February 2020', () =>
    expect(daysElapsed('2020-02')).toBe(29))
  it('returns a value between 1 and 31 for the current month', () => {
    const d = daysElapsed(isoCurrentMonth())
    expect(d).toBeGreaterThanOrEqual(1)
    expect(d).toBeLessThanOrEqual(31)
  })
})

describe('getPrevMonth', () => {
  it('goes back one month', () =>
    expect(getPrevMonth('2026-05')).toBe('2026-04'))
  it('wraps from January to December of prior year', () =>
    expect(getPrevMonth('2026-01')).toBe('2025-12'))
})

describe('expenseMonth', () => {
  it('extracts YYYY-MM from a full date', () => {
    expect(expenseMonth(mkExp({ id: 'x', date: '2026-05-14' }))).toBe('2026-05')
    expect(expenseMonth(mkExp({ id: 'x', date: '2026-12-31' }))).toBe('2026-12')
  })
})

describe('getAvailableMonths', () => {
  it('returns sorted unique months from expense dates plus current month', () => {
    const expenses = [
      mkExp({ id: 'a', date: '2026-05-01' }),
      mkExp({ id: 'b', date: '2026-03-15' }),
      mkExp({ id: 'c', date: '2026-05-20' }),
    ]
    const months = getAvailableMonths(expenses)
    expect(months).toContain('2026-03')
    expect(months).toContain('2026-05')
    expect(months).toContain(isoCurrentMonth())
    expect(months).toEqual([...new Set(months)].sort())
  })

  it('always includes the current month even with no expenses', () => {
    expect(getAvailableMonths([])).toContain(isoCurrentMonth())
  })
})

describe('calcMonthTotal', () => {
  const expenses = [
    mkExp({ id: 'a', date: '2026-05-01', amount: -100 }),
    mkExp({ id: 'b', date: '2026-05-15', amount: -200 }),
    mkExp({ id: 'c', date: '2026-04-10', amount: -500 }),
  ]
  it('sums only expenses in the given month', () => {
    expect(calcMonthTotal(expenses, '2026-05')).toBe(-300)
  })
  it('returns 0 for a month with no expenses', () => {
    expect(calcMonthTotal(expenses, '2026-06')).toBe(0)
  })
})

describe('calcTopCategory', () => {
  it('returns null for an empty month', () => {
    expect(calcTopCategory([], '2026-05')).toBeNull()
  })

  it('returns the category with the largest absolute spend', () => {
    const expenses = [
      mkExp({ id: 'a', date: '2026-05-01', cat: 1, amount: -100 }),
      mkExp({ id: 'b', date: '2026-05-02', cat: 7, amount: -5000 }),
      mkExp({ id: 'c', date: '2026-05-03', cat: 1, amount: -200 }),
    ]
    const top = calcTopCategory(expenses, '2026-05')
    expect(top).not.toBeNull()
    expect(top!.cat).toBe(7)
  })
})

// 2026-06-29 is a Monday — weekStart=2026-06-29, weekEnd=2026-07-05
// last week: 2026-06-22 to 2026-06-28
describe('periodSummary — week frequency filter', () => {
  const TODAY = '2026-06-30' // Tuesday
  // freq IDs: 1=Daily, 2=Weekly, 3=Yearly, 4=Monthly
  const WEEK_IDS = new Set([1, 2])

  it('includes daily (freq=1) expenses in this week', () => {
    const expenses = [
      mkExp({ id: 'a', date: '2026-06-29', amount: -500, freq: 1 }),
    ]
    const P = periodSummary(expenses, TODAY, { weekFreqIds: WEEK_IDS })
    expect(P.week).toBe(-500)
    expect(P.weekCount).toBe(1)
  })

  it('includes weekly (freq=2) expenses in this week', () => {
    const expenses = [
      mkExp({ id: 'a', date: '2026-07-01', amount: -300, freq: 2 }),
    ]
    const P = periodSummary(expenses, TODAY, { weekFreqIds: WEEK_IDS })
    expect(P.week).toBe(-300)
  })

  it('excludes monthly (freq=4) expenses from this week', () => {
    const expenses = [
      mkExp({ id: 'a', date: '2026-06-30', amount: -1000, freq: 4 }),
    ]
    const P = periodSummary(expenses, TODAY, { weekFreqIds: WEEK_IDS })
    expect(P.week).toBe(0)
    expect(P.weekCount).toBe(0)
  })

  it('excludes yearly (freq=3) expenses from this week', () => {
    const expenses = [
      mkExp({ id: 'a', date: '2026-06-30', amount: -2000, freq: 3 }),
    ]
    const P = periodSummary(expenses, TODAY, { weekFreqIds: WEEK_IDS })
    expect(P.week).toBe(0)
  })

  it('includes null-freq (one-time) expenses in this week', () => {
    const expenses = [
      mkExp({ id: 'a', date: '2026-06-30', amount: -700, freq: null }),
    ]
    const P = periodSummary(expenses, TODAY, { weekFreqIds: WEEK_IDS })
    expect(P.week).toBe(-700)
  })

  it('applies the same filter to last week for a fair weekDelta', () => {
    const expenses = [
      mkExp({ id: 'a', date: '2026-06-30', amount: -200, freq: 1 }), // this week daily
      mkExp({ id: 'b', date: '2026-06-30', amount: -500, freq: 4 }), // this week monthly — excluded
      mkExp({ id: 'c', date: '2026-06-22', amount: -200, freq: 1 }), // last week daily
      mkExp({ id: 'd', date: '2026-06-22', amount: -500, freq: 4 }), // last week monthly — excluded
    ]
    const P = periodSummary(expenses, TODAY, { weekFreqIds: WEEK_IDS })
    // both weeks: -200 daily only → 0% delta
    expect(P.weekDelta).toBe(0)
  })

  it('without opts all expenses are included (backward compat)', () => {
    const expenses = [
      mkExp({ id: 'a', date: '2026-06-30', amount: -500, freq: 4 }),
      mkExp({ id: 'b', date: '2026-06-30', amount: -300, freq: 1 }),
    ]
    const P = periodSummary(expenses, TODAY)
    expect(P.week).toBe(-800)
  })
})

describe('periodSummary — today frequency filter', () => {
  const TODAY = '2026-06-30'
  const TODAY_IDS = new Set([1]) // daily only

  it('includes daily (freq=1) expenses today', () => {
    const expenses = [mkExp({ id: 'a', date: TODAY, amount: -400, freq: 1 })]
    const P = periodSummary(expenses, TODAY, { todayFreqIds: TODAY_IDS })
    expect(P.today).toBe(-400)
    expect(P.todayCount).toBe(1)
  })

  it('excludes weekly (freq=2) expenses from today', () => {
    const expenses = [mkExp({ id: 'a', date: TODAY, amount: -300, freq: 2 })]
    const P = periodSummary(expenses, TODAY, { todayFreqIds: TODAY_IDS })
    expect(P.today).toBe(0)
    expect(P.todayCount).toBe(0)
  })

  it('excludes monthly (freq=4) expenses from today', () => {
    const expenses = [mkExp({ id: 'a', date: TODAY, amount: -1000, freq: 4 })]
    const P = periodSummary(expenses, TODAY, { todayFreqIds: TODAY_IDS })
    expect(P.today).toBe(0)
  })

  it('includes null-freq (one-time) expenses today', () => {
    const expenses = [mkExp({ id: 'a', date: TODAY, amount: -600, freq: null })]
    const P = periodSummary(expenses, TODAY, { todayFreqIds: TODAY_IDS })
    expect(P.today).toBe(-600)
  })

  it('without todayFreqIds all expenses today are included', () => {
    const expenses = [
      mkExp({ id: 'a', date: TODAY, amount: -400, freq: 1 }),
      mkExp({ id: 'b', date: TODAY, amount: -300, freq: 4 }),
    ]
    const P = periodSummary(expenses, TODAY)
    expect(P.today).toBe(-700)
  })
})
