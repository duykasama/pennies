import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { formatVnd } from '#/lib/pennies'
import { CATEGORY_TO_API } from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'
import { createExpenseFn } from '#/lib/expenses'
import { ROUTES, SORT, FILTER } from '#/lib/constants'
import MobileAddExpense from '#/components/pennies/mobile/AddExpense'
import TopNav from '#/components/pennies/desktop/TopNav'
import DesktopAddExpense from '#/components/pennies/desktop/AddExpense'

export const Route = createFileRoute('/_authenticated/expenses/add')({ component: AddExpensePage })

function AddExpensePage() {
  const navigate = useNavigate()
  const { queryClient } = Route.useRouteContext()

  async function handleSave(exp: Expense) {
    await createExpenseFn({
      data: {
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
      search: { filter: FILTER.ALL, sort: SORT.DATE, toast: formatVnd(exp.amount) },
    })
  }

  function handleCancel() {
    navigate({ to: ROUTES.DASHBOARD })
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Mobile — no BottomNav on the add screen */}
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileAddExpense onCancel={handleCancel} onSave={handleSave} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block w-full min-h-screen bg-bg-base font-sans text-sea-ink">
        <TopNav />
        <DesktopAddExpense onCancel={handleCancel} onSave={handleSave} />
      </div>
    </div>
  )
}
