import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ROUTES } from '#/lib/constants'
import { forgotPasswordFn } from '#/lib/auth'
import DesktopForgotPassword from '#/components/pennies/desktop/auth/ForgotPassword'
import MobileForgotPassword from '#/components/pennies/mobile/auth/ForgotPassword'

export const Route = createFileRoute('/auth/forgot-password')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: ROUTES.DASHBOARD })
  },
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(email: string) {
    setError(null)
    setLoading(true)
    try {
      await forgotPasswordFn({ data: { email } })
      sessionStorage.setItem('pennies:cooldown_trigger', '1')
      navigate({ to: ROUTES.AUTH_CHECK_EMAIL, search: { email, from: 'forgot-password' } })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  function handleBack() {
    navigate({ to: ROUTES.AUTH_SIGN_IN })
  }

  return (
    <>
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileForgotPassword onSubmit={handleSubmit} onBack={handleBack} error={error} loading={loading} />
      </div>
      <div className="hidden md:block w-full min-h-screen font-sans text-sea-ink">
        <DesktopForgotPassword onSubmit={handleSubmit} onBack={handleBack} error={error} loading={loading} />
      </div>
    </>
  )
}
