import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ExpenseRow from '#/components/pennies/ExpenseRow'
import { formatVnd } from '#/lib/pennies'
import i18n from '#/lib/i18n'
import { TestProviders } from '#/test/test-providers'
import type { Expense } from '#/lib/pennies'

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

const baseExpense: Expense = {
  id: 'e1',
  cat: 1,
  title: 'Food & Drink',
  sub: 'Lunch at pho place',
  amount: -65000,
  date: 'today',
  updatedAt: '2026-06-01T00:00:00Z',
}

describe('ExpenseRow', () => {
  it('renders the title', () => {
    render(<ExpenseRow expense={baseExpense} />, { wrapper: TestProviders })
    expect(screen.getByText('Food & Drink')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<ExpenseRow expense={baseExpense} />, { wrapper: TestProviders })
    expect(screen.getByText('Lunch at pho place')).toBeInTheDocument()
  })

  it('renders the formatted amount', () => {
    render(<ExpenseRow expense={baseExpense} />, { wrapper: TestProviders })
    const amount = formatVnd(baseExpense.amount)
    expect(screen.getByText(amount)).toBeInTheDocument()
  })

  it('renders the category emoji', () => {
    render(<ExpenseRow expense={baseExpense} />, { wrapper: TestProviders })
    expect(screen.getByText('🍴')).toBeInTheDocument()
  })

  it('shows translated "Today" for date=today', () => {
    render(<ExpenseRow expense={{ ...baseExpense, date: 'today' }} variant="desktop" />, {
      wrapper: TestProviders,
    })
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('shows translated "Yesterday" for date=yesterday', () => {
    render(<ExpenseRow expense={{ ...baseExpense, date: 'yesterday' }} variant="desktop" />, {
      wrapper: TestProviders,
    })
    expect(screen.getByText('Yesterday')).toBeInTheDocument()
  })

  it('formats ISO date string when date is not today or yesterday', () => {
    render(<ExpenseRow expense={{ ...baseExpense, date: '2026-05-12' }} variant="desktop" />, {
      wrapper: TestProviders,
    })
    expect(screen.getByText('May 12')).toBeInTheDocument()
  })

  it('does not render date column in mobile variant', () => {
    render(<ExpenseRow expense={{ ...baseExpense, date: 'today' }} variant="mobile" />, {
      wrapper: TestProviders,
    })
    expect(screen.queryByText('Today')).not.toBeInTheDocument()
  })
})
