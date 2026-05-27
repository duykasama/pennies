import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ExpenseList from '#/components/pennies/desktop/ExpenseList'
import { formatVnd } from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'
import { SORT, FILTER } from '#/lib/constants'
import i18n from '#/lib/i18n'
import { I18nWrapper } from '#/test/i18n-wrapper'

const noop = vi.fn()

const today = new Date().toISOString().slice(0, 10)
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
const older = '2026-05-12'

const TEST_EXPENSES: Expense[] = [
  { id: 'e1', cat: 'food', title: 'Food & Drink', sub: 'Lunch', amount: -65000, date: today },
  { id: 'e2', cat: 'transport', title: 'Transport', sub: 'Grab', amount: -25000, date: today },
  { id: 'e3', cat: 'shopping', title: 'Shopping', sub: 'Bookstore', amount: -320000, date: today },
  { id: 'e4', cat: 'health', title: 'Health', sub: 'Pharmacy', amount: -85000, date: yesterday },
  { id: 'e5', cat: 'fun', title: 'Entertainment', sub: 'Cinema', amount: -180000, date: yesterday },
  { id: 'e6', cat: 'food', title: 'Food & Drink', sub: 'Coffee', amount: -55000, date: older },
  { id: 'e7', cat: 'util', title: 'Utilities', sub: 'Electric', amount: -420000, date: older },
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
        { wrapper: I18nWrapper },
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
          filter="food"
          setFilter={noop}
          sort={SORT.DATE}
          setSort={noop}
        />,
        { wrapper: I18nWrapper },
      )
      const foodExpenses = TEST_EXPENSES.filter((e) => e.cat === 'food')
      const otherExpenses = TEST_EXPENSES.filter((e) => e.cat !== 'food')
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
          filter="housing"
          setFilter={noop}
          sort={SORT.DATE}
          setSort={noop}
        />,
        { wrapper: I18nWrapper },
      )
      expect(screen.getByText(/no expenses in this filter/i)).toBeInTheDocument()
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
        { wrapper: I18nWrapper },
      )
      const sorted = [...TEST_EXPENSES].sort((a, b) => a.amount - b.amount)
      const amounts = screen
        .getAllByText(/^-?₫/)
        .map((el) => el.textContent)
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
        { wrapper: I18nWrapper },
      )
      expect(screen.getAllByText(/today/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/yesterday/i).length).toBeGreaterThan(0)
    })
  })
})
