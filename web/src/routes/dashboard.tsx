import { createFileRoute } from '@tanstack/react-router'
import { useExpenses } from '#/lib/penniesStore'
import BottomNav from '#/components/pennies/mobile/BottomNav'
import MobileDashboard from '#/components/pennies/mobile/Dashboard'
import TopNav from '#/components/pennies/desktop/TopNav'
import DesktopDashboard from '#/components/pennies/desktop/Dashboard'

export const Route = createFileRoute('/dashboard')({ component: DashboardPage })

function DashboardPage() {
  const expenses = useExpenses()

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
