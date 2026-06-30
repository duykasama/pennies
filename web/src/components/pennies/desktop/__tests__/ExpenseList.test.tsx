import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ExpenseList from '#/components/pennies/desktop/ExpenseList'
import { formatVnd } from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'
import { SORT, FILTER } from '#/lib/constants'
import i18n from '#/lib/i18n'
import { TestProviders } from '#/test/test-providers'

const noop = vi.fn()

const today = new Date().toISOString().slice(0, 10)
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
const older = '2026-05-12'

const TEST_EXPENSES: Expense[] = [
  {
    id: 'e1',
    cat: 1,
    title: 'Food & Drink',
    sub: 'Lunch',
    amount: -65000,
    date: today,
    freq: 1,
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'e2',
    cat: 2,
    title: 'Transport',
    sub: 'Grab',
    amount: -25000,
    date: today,
    freq: 1,
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'e3',
    cat: 3,
    title: 'Shopping',
    sub: 'Bookstore',
    amount: -320000,
    date: today,
    freq: 1,
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'e4',
    cat: 5,
    title: 'Health',
    sub: 'Pharmacy',
    amount: -85000,
    date: yesterday,
    freq: 1,
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'e5',
    cat: 4,
    title: 'Entertainment',
    sub: 'Cinema',
    amount: -180000,
    date: yesterday,
    freq: 1,
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'e6',
    cat: 1,
    title: 'Food & Drink',
    sub: 'Coffee',
    amount: -55000,
    date: older,
    freq: 1,
    updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'e7',
    cat: 6,
    title: 'Utilities',
    sub: 'Electric',
    amount: -420000,
    date: older,
    freq: 1,
    updatedAt: '2026-06-01T00:00:00Z',
  },
]

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

describe('ExpenseList', () => {
  describe('filtering', () => {
    it('shows all expenses when filter is ALL', () => {
      render(
        <ExpenseList
          expenses={TEST_EXPENSES}
          filter={FILTER.ALL}
          setFilter={noop}
          sort={SORT.DATE}
          setSort={noop}
        />,
        { wrapper: TestProviders },
      )
      const amounts = TEST_EXPENSES.map((e) => formatVnd(e.amount))
      for (const amount of amounts) {
        expect(screen.getByText(amount)).toBeInTheDocument()
      }
    })

    it('shows only food expenses when filtered by food', () => {
      render(
        <ExpenseList
          expenses={TEST_EXPENSES}
          filter="1"
          setFilter={noop}
          sort={SORT.DATE}
          setSort={noop}
        />,
        { wrapper: TestProviders },
      )
      const foodExpenses = TEST_EXPENSES.filter((e) => e.cat === 1)
      const otherExpenses = TEST_EXPENSES.filter((e) => e.cat !== 1)
      for (const e of foodExpenses) {
        expect(screen.getByText(formatVnd(e.amount))).toBeInTheDocument()
      }
      for (const e of otherExpenses) {
        expect(screen.queryByText(formatVnd(e.amount))).not.toBeInTheDocument()
      }
    })

    it('shows empty-state message when no expenses match the filter', () => {
      render(
        <ExpenseList
          expenses={TEST_EXPENSES}
          filter="7"
          setFilter={noop}
          sort={SORT.DATE}
          setSort={noop}
        />,
        { wrapper: TestProviders },
      )
      expect(
        screen.getByText(/no expenses in this filter/i),
      ).toBeInTheDocument()
    })
  })

  describe('sorting', () => {
    it('sorts by amount — largest spend first', () => {
      render(
        <ExpenseList
          expenses={TEST_EXPENSES}
          filter={FILTER.ALL}
          setFilter={noop}
          sort={SORT.AMOUNT}
          setSort={noop}
        />,
        { wrapper: TestProviders },
      )
      const sorted = [...TEST_EXPENSES].sort((a, b) => a.amount - b.amount)
      const amounts = screen.getAllByText(/^-?₫/).map((el) => el.textContent)
      const expectedAmounts = sorted.map((e) => formatVnd(e.amount))
      expect(amounts).toEqual(expectedAmounts)
    })

    it('groups by date label when sorting by date', () => {
      render(
        <ExpenseList
          expenses={TEST_EXPENSES}
          filter={FILTER.ALL}
          setFilter={noop}
          sort={SORT.DATE}
          setSort={noop}
        />,
        { wrapper: TestProviders },
      )
      expect(screen.getAllByText(/today/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/yesterday/i).length).toBeGreaterThan(0)
    })
  })
})
