import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getExpensesFn, mapApiExpense } from '#/lib/expenses'
import BottomNav from '#/components/pennies/mobile/BottomNav'
import MobileDashboard from '#/components/pennies/mobile/Dashboard'
import TopNav from '#/components/pennies/desktop/TopNav'
import DesktopDashboard from '#/components/pennies/desktop/Dashboard'

const dashboardQuery = {
  queryKey: ['expenses', 'all'],
  queryFn: () => getExpensesFn({ data: { pageSize: 100 } }),
}

export const Route = createFileRoute('/_authenticated/dashboard')({
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQuery),
  component: DashboardPage,
})

function DashboardPage() {
  const { data } = useSuspenseQuery(dashboardQuery)
  const expenses = data.items.map(mapApiExpense)

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Mobile */}
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <BottomNav />
        <MobileDashboard expenses={expenses} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block w-full min-h-screen bg-bg-base font-sans text-sea-ink">
        <TopNav />
        <DesktopDashboard expenses={expenses} />
      </div>
    </div>
  )
}
