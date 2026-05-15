import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ROUTES } from '#/lib/constants'
import MobileSignUp from '#/components/pennies/mobile/auth/SignUp'
import DesktopSignUp from '#/components/pennies/desktop/auth/SignUp'

export const Route = createFileRoute('/auth/sign-up')({ component: SignUpPage })

function SignUpPage() {
  const navigate = useNavigate()

  function handleSubmit(_name: string, email: string) {
    navigate({ to: ROUTES.AUTH_CHECK_EMAIL, search: { email } })
  }

  function handleGoogle() {
    navigate({ to: ROUTES.AUTH_VERIFIED })
  }

  function handleSignIn() {
    navigate({ to: ROUTES.AUTH_SIGN_IN })
  }

  return (
    <>
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileSignUp onSubmit={handleSubmit} onGoogle={handleGoogle} onSignIn={handleSignIn} />
      </div>
      <div className="hidden md:block w-full min-h-screen font-sans text-sea-ink">
        <DesktopSignUp onSubmit={handleSubmit} onGoogle={handleGoogle} onSignIn={handleSignIn} />
      </div>
    </>
  )
}
