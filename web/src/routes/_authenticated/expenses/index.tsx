import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getExpensesFn, mapApiExpense } from '#/lib/expenses'
import type { Expense } from '#/lib/pennies'
import { ROUTES, SORT, FILTER } from '#/lib/constants'
import type { SortOption } from '#/lib/constants'
import { ExpensesPageLayout } from './-shared'

const listQueryOptions = {
  queryKey: ['expenses', 'list'],
  queryFn: ({ pageParam }: { pageParam: number }) =>
    getExpensesFn({ data: { pageIndex: pageParam } }),
  initialPageParam: 1,
  getNextPageParam: (lastPage: Awaited<ReturnType<typeof getExpensesFn>>) =>
    lastPage.pageIndex < lastPage.totalPages
      ? lastPage.pageIndex + 1
      : undefined,
}

export const Route = createFileRoute('/_authenticated/expenses/')({
  loader: ({ context }) =>
    context.queryClient.prefetchInfiniteQuery(listQueryOptions),
  validateSearch: (
    search: Record<string, unknown>,
  ): { filter: string; sort: SortOption; toast?: string } => ({
    filter: typeof search.filter === 'string' ? search.filter : FILTER.ALL,
    sort: search.sort === SORT.AMOUNT ? SORT.AMOUNT : SORT.DATE,
    toast: typeof search.toast === 'string' ? search.toast : undefined,
  }),
  component: ExpensesPage,
})

function ExpensesPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(listQueryOptions)
  const expenses = data?.pages.flatMap((p) => p.items.map(mapApiExpense)) ?? []
  const { filter, sort, toast } = Route.useSearch()
  const navigate = useNavigate()
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    navigate({ to: ROUTES.EXPENSES, search: { filter, sort }, replace: true })
    setToastMsg(toast)
    const timer = setTimeout(() => setToastMsg(null), 2200)
    return () => clearTimeout(timer)
  }, [toast]) // intentionally omits filter/sort — only runs when toast param appears

  function setFilter(f: string) {
    navigate({ to: ROUTES.EXPENSES, search: { filter: f, sort } })
  }

  function setSort(s: SortOption) {
    navigate({ to: ROUTES.EXPENSES, search: { filter, sort: s } })
  }

  function openExpense(exp: Expense) {
    navigate({
      to: '/expenses/$expenseId',
      params: { expenseId: exp.id },
      search: { filter, sort },
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
      editingExpense={null}
      onCloseEdit={() => {}}
      onUpdate={async () => {}}
      onDelete={async () => {}}
      toastMsg={toastMsg}
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
    />
  )
}
