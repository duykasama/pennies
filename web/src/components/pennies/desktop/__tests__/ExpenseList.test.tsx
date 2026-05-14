import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ExpenseList from '#/components/pennies/desktop/ExpenseList'
import { SEED_EXPENSES, formatVnd } from '#/lib/pennies'
import { SORT, FILTER } from '#/lib/constants'
import i18n from '#/lib/i18n'
import { I18nWrapper } from '#/test/i18n-wrapper'

const noop = vi.fn()

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

describe('ExpenseList', () => {
  describe('filtering', () => {
    it('shows all expenses when filter is ALL', () => {
      render(
        <ExpenseList
          expenses={SEED_EXPENSES}
          filter={FILTER.ALL}
          setFilter={noop}
          sort={SORT.DATE}
          setSort={noop}
        />,
        { wrapper: I18nWrapper },
      )
      const amounts = SEED_EXPENSES.map((e) => formatVnd(e.amount))
      for (const amount of amounts) {
        expect(screen.getByText(amount)).toBeInTheDocument()
      }
    })

    it('shows only food expenses when filtered by food', () => {
      render(
        <ExpenseList
          expenses={SEED_EXPENSES}
          filter="food"
          setFilter={noop}
          sort={SORT.DATE}
          setSort={noop}
        />,
        { wrapper: I18nWrapper },
      )
      const foodExpenses = SEED_EXPENSES.filter((e) => e.cat === 'food')
      const otherExpenses = SEED_EXPENSES.filter((e) => e.cat !== 'food')
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
          expenses={SEED_EXPENSES}
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
          expenses={SEED_EXPENSES}
          filter={FILTER.ALL}
          setFilter={noop}
          sort={SORT.AMOUNT}
          setSort={noop}
        />,
        { wrapper: I18nWrapper },
      )
      const sorted = [...SEED_EXPENSES].sort((a, b) => a.amount - b.amount)
      const amounts = screen
        .getAllByText(/^-?₫/)
        .map((el) => el.textContent)
      const expectedAmounts = sorted.map((e) => formatVnd(e.amount))
      expect(amounts).toEqual(expectedAmounts)
    })

    it('groups by date label when sorting by date', () => {
      render(
        <ExpenseList
          expenses={SEED_EXPENSES}
          filter={FILTER.ALL}
          setFilter={noop}
          sort={SORT.DATE}
          setSort={noop}
        />,
        { wrapper: I18nWrapper },
      )
      // Date group headers appear as "— Today", "— Yesterday", "— May 12"
      expect(screen.getAllByText(/today/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/yesterday/i).length).toBeGreaterThan(0)
    })
  })
})
