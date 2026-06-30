import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useInfiniteQuery,
  useSuspenseQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  getExpenseFn,
  getExpensesFn,
  mapApiExpense,
  updateExpenseFn,
  deleteExpenseFn,
} from '#/lib/expenses'
import { formatVnd } from '#/lib/pennies'
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

export const Route = createFileRoute('/_authenticated/expenses/$expenseId')({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.prefetchInfiniteQuery(listQueryOptions),
      context.queryClient.ensureQueryData({
        queryKey: ['expense', params.expenseId],
        queryFn: () => getExpenseFn({ data: { id: params.expenseId } }),
      }),
    ])
  },
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
  const {
    data: listData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(listQueryOptions)
  const expenses =
    listData?.pages.flatMap((p) => p.items.map(mapApiExpense)) ?? []
  const { data: singleExpense } = useSuspenseQuery({
    queryKey: ['expense', expenseId],
    queryFn: () => getExpenseFn({ data: { id: expenseId } }),
  })
  const expense = mapApiExpense(singleExpense)
  const { filter, sort } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toastMsg = null

  function setFilter(f: string) {
    navigate({
      to: '/expenses/$expenseId',
      params: { expenseId },
      search: { filter: f, sort },
    })
  }

  function setSort(s: SortOption) {
    navigate({
      to: '/expenses/$expenseId',
      params: { expenseId },
      search: { filter, sort: s },
    })
  }

  function openExpense(exp: Expense) {
    navigate({
      to: '/expenses/$expenseId',
      params: { expenseId: exp.id },
      search: { filter, sort },
    })
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
        category: exp.cat,
        frequency: exp.freq,
        date: exp.date,
        updatedAt: exp.updatedAt,
      },
    })
    await queryClient.invalidateQueries({ queryKey: ['expenses'] })
    navigate({
      to: ROUTES.EXPENSES,
      search: {
        filter,
        sort,
        toast: t('editExpense.update') + ' · ' + formatVnd(exp.amount),
      },
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
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
    />
  )
}
