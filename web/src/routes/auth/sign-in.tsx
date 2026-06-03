import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ROUTES } from '#/lib/constants'
import { loginFn, getGoogleAuthUrlFn } from '#/lib/auth'
import MobileSignIn from '#/components/pennies/mobile/auth/SignIn'
import DesktopSignIn from '#/components/pennies/desktop/auth/SignIn'

export const Route = createFileRoute('/auth/sign-in')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: ROUTES.DASHBOARD })
  },
  component: SignInPage,
})

function SignInPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(email: string, password: string) {
    setError(null)
    try {
      await loginFn({ data: { email, password } })
      navigate({ to: ROUTES.DASHBOARD })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed')
    }
  }

  async function handleGoogle() {
    const url = await getGoogleAuthUrlFn()
    window.location.href = url
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
          error={error}
        />
      </div>
      <div className="hidden md:block w-full min-h-screen font-sans text-sea-ink">
        <DesktopSignIn
          onSubmit={handleSubmit}
          onGoogle={handleGoogle}
          onSignUp={handleSignUp}
          onForgot={handleForgot}
          error={error}
        />
      </div>
    </>
  )
}
