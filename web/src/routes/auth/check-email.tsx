import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ROUTES } from '#/lib/constants'
import { forgotPasswordFn } from '#/lib/auth'
import { useResendCooldown } from '#/hooks/useResendCooldown'
import MobileCheckEmail from '#/components/pennies/mobile/auth/CheckEmail'
import DesktopCheckEmail from '#/components/pennies/desktop/auth/CheckEmail'

export const Route = createFileRoute('/auth/check-email')({
  validateSearch: (search) => ({
    email: typeof search.email === 'string' ? search.email : '',
    from: typeof search.from === 'string' ? search.from : '',
  }),
  component: CheckEmailPage,
})

function CheckEmailPage() {
  const { email, from } = Route.useSearch()
  const navigate = useNavigate()
  const [resending, setResending] = useState(false)
  const { secondsLeft, startCooldown } = useResendCooldown({ email })

  function handleOpenMailApp() {
    if (window.confirm('Open Gmail in a new tab?')) {
      window.open('https://mail.google.com', '_blank')
    }
  }

  function handleUseDifferent() {
    navigate({ to: from === 'forgot-password' ? ROUTES.AUTH_FORGOT_PASSWORD : ROUTES.AUTH_SIGN_UP })
  }

  async function handleResend() {
    if (!email || resending || secondsLeft > 0) return
    setResending(true)
    try {
      await forgotPasswordFn({ data: { email } })
      startCooldown()
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileCheckEmail
          email={email || 'alex@example.com'}
          onOpenMailApp={handleOpenMailApp}
          onResend={handleResend}
          secondsLeft={secondsLeft}
          onUseDifferent={handleUseDifferent}
        />
      </div>
      <div className="hidden md:block w-full min-h-screen font-sans text-sea-ink">
        <DesktopCheckEmail
          email={email || 'alex@example.com'}
          onOpenMailApp={handleOpenMailApp}
          onResend={handleResend}
          secondsLeft={secondsLeft}
          onUseDifferent={handleUseDifferent}
        />
      </div>
    </>
  )
}
