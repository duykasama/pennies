import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ROUTES } from '#/lib/constants'
import MobileSignIn from '#/components/pennies/mobile/auth/SignIn'
import DesktopSignIn from '#/components/pennies/desktop/auth/SignIn'

export const Route = createFileRoute('/auth/sign-in')({ component: SignInPage })

function SignInPage() {
  const navigate = useNavigate()

  function handleSubmit(email: string) {
    const masked = email.replace(/^(.).*@/, (_, c) => `${c}***@`)
    navigate({ to: ROUTES.AUTH_VERIFY, search: { email: masked } })
  }

  function handleGoogle() {
    navigate({ to: ROUTES.DASHBOARD })
  }

  function handleSignUp() {
    navigate({ to: ROUTES.AUTH_SIGN_UP })
  }

  function handleForgot() {
    navigate({ to: ROUTES.AUTH_CHECK_EMAIL, search: { email: '' } })
  }

  return (
    <>
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileSignIn
          onSubmit={handleSubmit}
          onGoogle={handleGoogle}
          onSignUp={handleSignUp}
          onForgot={handleForgot}
        />
      </div>
      <div className="hidden md:block w-full min-h-screen font-sans text-sea-ink">
        <DesktopSignIn
          onSubmit={handleSubmit}
          onGoogle={handleGoogle}
          onSignUp={handleSignUp}
          onForgot={handleForgot}
        />
      </div>
    </>
  )
}
