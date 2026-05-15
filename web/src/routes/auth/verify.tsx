import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ROUTES } from '#/lib/constants'
import MobileTwoFactor from '#/components/pennies/mobile/auth/TwoFactor'
import DesktopTwoFactor from '#/components/pennies/desktop/auth/TwoFactor'

export const Route = createFileRoute('/auth/verify')({
  validateSearch: (search) => ({
    email: typeof search.email === 'string' ? search.email : 'a***@example.com',
  }),
  component: VerifyPage,
})

function VerifyPage() {
  const { email } = Route.useSearch()
  const navigate = useNavigate()

  function handleVerify() {
    navigate({ to: ROUTES.DASHBOARD })
  }

  function handleBack() {
    navigate({ to: ROUTES.AUTH_SIGN_IN })
  }

  return (
    <>
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileTwoFactor
          email={email}
          onVerify={handleVerify}
          onResend={() => {}}
          onBack={handleBack}
        />
      </div>
      <div className="hidden md:block w-full min-h-screen font-sans text-sea-ink">
        <DesktopTwoFactor
          email={email}
          onVerify={handleVerify}
          onResend={() => {}}
          onBack={handleBack}
        />
      </div>
    </>
  )
}
