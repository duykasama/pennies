import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ROUTES } from '#/lib/constants'
import MobileRegSuccess from '#/components/pennies/mobile/auth/RegSuccess'
import DesktopRegSuccess from '#/components/pennies/desktop/auth/RegSuccess'

export const Route = createFileRoute('/auth/verified')({
  component: VerifiedPage,
})

function VerifiedPage() {
  const navigate = useNavigate()

  function handleContinue() {
    navigate({ to: ROUTES.DASHBOARD })
  }

  return (
    <>
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileRegSuccess onContinue={handleContinue} />
      </div>
      <div className="hidden md:block w-full min-h-screen font-sans text-sea-ink">
        <DesktopRegSuccess onContinue={handleContinue} />
      </div>
    </>
  )
}
