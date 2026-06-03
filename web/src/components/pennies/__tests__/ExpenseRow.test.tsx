import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ExpenseRow from '#/components/pennies/ExpenseRow'
import { formatVnd, CAT_BY_ID } from '#/lib/pennies'
import i18n from '#/lib/i18n'
import { I18nWrapper } from '#/test/i18n-wrapper'
import type { Expense } from '#/lib/pennies'

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

const baseExpense: Expense = {
  id: 'e1',
  cat: 'food',
  title: 'Food & Drink',
  sub: 'Lunch at pho place',
  amount: -65000,
  date: 'today',
  updatedAt: '2026-06-01T00:00:00Z',
}

describe('ExpenseRow', () => {
  it('renders the subtitle', () => {
    render(<ExpenseRow expense={baseExpense} />, { wrapper: I18nWrapper })
    expect(screen.getByText('Lunch at pho place')).toBeInTheDocument()
  })

  it('renders the formatted amount', () => {
    render(<ExpenseRow expense={baseExpense} />, { wrapper: I18nWrapper })
    const amount = formatVnd(baseExpense.amount)
    expect(screen.getByText(amount)).toBeInTheDocument()
  })

  it('renders the category emoji', () => {
    render(<ExpenseRow expense={baseExpense} />, { wrapper: I18nWrapper })
    expect(screen.getByText(CAT_BY_ID['food'].emoji)).toBeInTheDocument()
  })

  it('shows translated "Today" for date=today', () => {
    render(<ExpenseRow expense={{ ...baseExpense, date: 'today' }} variant="desktop" />, {
      wrapper: I18nWrapper,
    })
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('shows translated "Yesterday" for date=yesterday', () => {
    render(<ExpenseRow expense={{ ...baseExpense, date: 'yesterday' }} variant="desktop" />, {
      wrapper: I18nWrapper,
    })
    expect(screen.getByText('Yesterday')).toBeInTheDocument()
  })

  it('shows the raw date string when date is not a known label', () => {
    render(<ExpenseRow expense={{ ...baseExpense, date: 'May 12' }} variant="desktop" />, {
      wrapper: I18nWrapper,
    })
    expect(screen.getByText('May 12')).toBeInTheDocument()
  })

  it('does not render date column in mobile variant', () => {
    render(<ExpenseRow expense={{ ...baseExpense, date: 'today' }} variant="mobile" />, {
      wrapper: I18nWrapper,
    })
    expect(screen.queryByText('Today')).not.toBeInTheDocument()
  })
})
