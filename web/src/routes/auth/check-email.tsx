import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ROUTES } from '#/lib/constants'
import MobileCheckEmail from '#/components/pennies/mobile/auth/CheckEmail'
import DesktopCheckEmail from '#/components/pennies/desktop/auth/CheckEmail'

export const Route = createFileRoute('/auth/check-email')({
  validateSearch: (search) => ({
    email: typeof search.email === 'string' ? search.email : '',
  }),
  component: CheckEmailPage,
})

function CheckEmailPage() {
  const { email } = Route.useSearch()
  const navigate = useNavigate()

  function handleUseDifferent() {
    navigate({ to: ROUTES.AUTH_SIGN_UP })
  }

  return (
    <>
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileCheckEmail
          email={email || 'alex@example.com'}
          onResend={() => {}}
          onUseDifferent={handleUseDifferent}
        />
      </div>
      <div className="hidden md:block w-full min-h-screen font-sans text-sea-ink">
        <DesktopCheckEmail
          email={email || 'alex@example.com'}
          onResend={() => {}}
          onUseDifferent={handleUseDifferent}
        />
      </div>
    </>
  )
}
