import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getExpensesFn, mapApiExpense } from '#/lib/expenses'
import { ROUTES, SORT, FILTER } from '#/lib/constants'
import type { SortOption } from '#/lib/constants'
import BottomNav from '#/components/pennies/mobile/BottomNav'
import MobileExpenseList from '#/components/pennies/mobile/ExpenseList'
import TopNav from '#/components/pennies/desktop/TopNav'
import DesktopExpenseList from '#/components/pennies/desktop/ExpenseList'

const expensesQuery = { queryKey: ['expenses'], queryFn: () => getExpensesFn() }

export const Route = createFileRoute('/_authenticated/expenses/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(expensesQuery),
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
  const { data } = useSuspenseQuery(expensesQuery)
  const expenses = data.map(mapApiExpense)
  const { filter, sort, toast } = Route.useSearch()
  const navigate = useNavigate()
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    navigate({ to: ROUTES.EXPENSES, search: { filter, sort }, replace: true })
    setToastMsg(toast)
    const t = setTimeout(() => setToastMsg(null), 2200)
    return () => clearTimeout(t)
  }, [toast]) // intentionally omits filter/sort — only runs when toast param appears

  function setFilter(f: string) {
    navigate({ to: ROUTES.EXPENSES, search: { filter: f, sort } })
  }

  function setSort(s: SortOption) {
    navigate({ to: ROUTES.EXPENSES, search: { filter, sort: s } })
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Mobile */}
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <BottomNav />
        <MobileExpenseList
          expenses={expenses}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
        />
        {toastMsg && (
          <div className="fixed left-4 right-4 bottom-[84px] bg-sea-ink text-white px-[18px] py-3.5 rounded-p-md shadow-pop font-sans font-medium text-[13px] leading-tight flex items-center gap-2.5 toast-in z-50">
            <span className="text-lagoon-mist font-bold">✓</span>
            <span>{toastMsg}</span>
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block w-full min-h-screen bg-bg-base font-sans text-sea-ink">
        <TopNav />
        <DesktopExpenseList
          expenses={expenses}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
        />
        {toastMsg && (
          <div className="fixed right-8 bottom-8 bg-sea-ink text-white px-5 py-3.5 rounded-p-md shadow-pop font-sans font-medium text-[13px] leading-tight flex items-center gap-2.5 toast-in z-50">
            <span className="text-lagoon-mist font-bold">✓</span>
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </div>
  )
}
