import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mapApiExpense, updateExpenseFn, deleteExpenseFn } from '#/lib/expenses'
import { CATEGORY_TO_API, formatVnd } from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'
import { ROUTES, SORT, FILTER } from '#/lib/constants'
import type { SortOption } from '#/lib/constants'
import { expensesQuery, ExpensesPageLayout } from './-shared'

export const Route = createFileRoute('/_authenticated/expenses/$expenseId')({
  loader: ({ context }) => context.queryClient.ensureQueryData(expensesQuery),
  validateSearch: (
    search: Record<string, unknown>,
  ): { filter: string; sort: SortOption; toast?: string } => ({
    filter: typeof search.filter === 'string' ? search.filter : FILTER.ALL,
    sort: search.sort === SORT.AMOUNT ? SORT.AMOUNT : SORT.DATE,
    toast: typeof search.toast === 'string' ? search.toast : undefined,
  }),
  component: ExpenseDetailPage,
})

function ExpenseDetailPage() {
  const { t } = useTranslation()
  const { expenseId } = Route.useParams()
  const { data } = useSuspenseQuery(expensesQuery)
  const expenses = data.map(mapApiExpense)
  const expense = expenses.find((e) => e.id === expenseId) ?? null
  const { filter, sort } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!expense) {
      navigate({ to: ROUTES.EXPENSES, search: { filter, sort }, replace: true })
    }
  }, [expense])

  function setFilter(f: string) {
    navigate({ to: '/expenses/$expenseId', params: { expenseId }, search: { filter: f, sort } })
  }

  function setSort(s: SortOption) {
    navigate({ to: '/expenses/$expenseId', params: { expenseId }, search: { filter, sort: s } })
  }

  function openExpense(exp: Expense) {
    navigate({ to: '/expenses/$expenseId', params: { expenseId: exp.id }, search: { filter, sort } })
  }

  function handleClose() {
    navigate({ to: ROUTES.EXPENSES, search: { filter, sort } })
  }

  async function handleUpdate(exp: Expense) {
    await updateExpenseFn({
      data: {
        id: exp.id,
        title: exp.title,
        description: exp.sub || null,
        amount: exp.amount,
        category: CATEGORY_TO_API[exp.cat] ?? 8,
        date: exp.date,
      },
    })
    await queryClient.invalidateQueries({ queryKey: ['expenses'] })
    navigate({
      to: ROUTES.EXPENSES,
      search: { filter, sort, toast: t('editExpense.update') + ' · ' + formatVnd(exp.amount) },
    })
  }

  async function handleDelete(id: string) {
    await deleteExpenseFn({ data: { id } })
    await queryClient.invalidateQueries({ queryKey: ['expenses'] })
    navigate({
      to: ROUTES.EXPENSES,
      search: { filter, sort, toast: t('editExpense.delete') },
    })
  }

  return (
    <ExpensesPageLayout
      expenses={expenses}
      filter={filter}
      setFilter={setFilter}
      sort={sort}
      setSort={setSort}
      onOpenExpense={openExpense}
      editingExpense={expense}
      onCloseEdit={handleClose}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      toastMsg={toastMsg}
    />
  )
}
