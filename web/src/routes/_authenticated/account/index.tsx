import { createFileRoute, getRouteApi, useNavigate } from '@tanstack/react-router'
import { ROUTES } from '#/lib/constants'
import TopNav from '#/components/pennies/desktop/TopNav'
import DesktopAccountView from '#/components/pennies/desktop/account/AccountView'
import MobileAccountView from '#/components/pennies/mobile/account/AccountView'

export const Route = createFileRoute('/_authenticated/account/')({
  component: AccountPage,
})

const accountRoute = getRouteApi('/_authenticated/account')

function AccountPage() {
  const profile = accountRoute.useLoaderData()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Mobile */}
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileAccountView
          user={profile}
          onBack={() => navigate({ to: ROUTES.DASHBOARD })}
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:block w-full min-h-screen bg-bg-base font-sans text-sea-ink">
        <TopNav />
        <DesktopAccountView user={profile} />
      </div>
    </div>
  )
}
