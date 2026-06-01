import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ROUTES } from '#/lib/constants'
import { registerFn, getGoogleAuthUrlFn } from '#/lib/auth'
import MobileSignUp from '#/components/pennies/mobile/auth/SignUp'
import DesktopSignUp from '#/components/pennies/desktop/auth/SignUp'

export const Route = createFileRoute('/auth/sign-up')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: ROUTES.DASHBOARD })
  },
  component: SignUpPage,
})

function SignUpPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(name: string, email: string, password: string) {
    setError(null)
    try {
      await registerFn({ data: { displayName: name, email, password } })
      navigate({ to: ROUTES.AUTH_CHECK_EMAIL, search: { email } })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed')
    }
  }

  async function handleGoogle() {
    const url = await getGoogleAuthUrlFn()
    window.location.href = url
  }

  function handleSignIn() {
    navigate({ to: ROUTES.AUTH_SIGN_IN })
  }

  return (
    <>
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileSignUp onSubmit={handleSubmit} onGoogle={handleGoogle} onSignIn={handleSignIn} error={error} />
      </div>
      <div className="hidden md:block w-full min-h-screen font-sans text-sea-ink">
        <DesktopSignUp onSubmit={handleSubmit} onGoogle={handleGoogle} onSignIn={handleSignIn} error={error} />
      </div>
    </>
  )
}
