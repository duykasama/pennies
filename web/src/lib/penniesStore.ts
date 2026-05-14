import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/react-store'
import { SEED_EXPENSES } from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'

interface PenniesState {
  expenses: Expense[]
}

export const penniesStore = new Store<PenniesState>({
  expenses: SEED_EXPENSES,
})

export function addExpense(exp: Expense) {
  penniesStore.setState((s) => ({ expenses: [exp, ...s.expenses] }))
}

export function useExpenses() {
  return useStore(penniesStore, (s) => s.expenses)
}
