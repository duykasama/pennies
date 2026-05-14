import { describe, it, expect, beforeEach } from 'vitest'
import { penniesStore, addExpense } from '#/lib/penniesStore'
import { SEED_EXPENSES } from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'

beforeEach(() => {
  penniesStore.setState(() => ({ expenses: [...SEED_EXPENSES] }))
})

const newExpense: Expense = {
  id: 'test-1',
  cat: 'food',
  title: 'Food & Drink',
  sub: 'Test coffee',
  amount: -30000,
  date: 'today',
}

describe('addExpense', () => {
  it('prepends the expense to the list', () => {
    addExpense(newExpense)
    expect(penniesStore.state.expenses[0]).toEqual(newExpense)
  })

  it('increases the list length by 1', () => {
    const before = penniesStore.state.expenses.length
    addExpense(newExpense)
    expect(penniesStore.state.expenses.length).toBe(before + 1)
  })

  it('preserves all original expenses', () => {
    addExpense(newExpense)
    const ids = penniesStore.state.expenses.map((e) => e.id)
    for (const seed of SEED_EXPENSES) {
      expect(ids).toContain(seed.id)
    }
  })

  it('adding multiple expenses maintains prepend order', () => {
    const second: Expense = { ...newExpense, id: 'test-2', sub: 'Second' }
    addExpense(newExpense)
    addExpense(second)
    expect(penniesStore.state.expenses[0].id).toBe('test-2')
    expect(penniesStore.state.expenses[1].id).toBe('test-1')
  })
})
