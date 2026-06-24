import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '#/lib/constants'
import { logoutFn, resetPasswordFn } from '#/lib/auth'
import {
  DesktopResetPassword,
  DesktopResetSuccess,
} from '#/components/pennies/desktop/auth/ResetPassword'
import {
  MobileResetPassword,
  MobileResetSuccess,
} from '#/components/pennies/mobile/auth/ResetPassword'

const RESET_TOKEN_KEY = 'pennies_reset_token'

function saveResetToken(token: string) {
  localStorage.setItem(
    RESET_TOKEN_KEY,
    JSON.stringify({ token, expiresAt: Date.now() + 60 * 60 * 1000 }),
  )
}

function loadResetToken(): string | null {
  try {
    const raw = localStorage.getItem(RESET_TOKEN_KEY)
    if (!raw) return null
    const { token, expiresAt } = JSON.parse(raw) as {
      token: string
      expiresAt: number
    }
    if (Date.now() > expiresAt) {
      localStorage.removeItem(RESET_TOKEN_KEY)
      return null
    }
    return token
  } catch {
    return null
  }
}

function clearResetToken() {
  localStorage.removeItem(RESET_TOKEN_KEY)
}

export const Route = createFileRoute('/auth/reset-password')({
  validateSearch: (search) => ({
    t: typeof search.t === 'string' ? search.t : '',
  }),
  beforeLoad: async ({ context }) => {
    if (context.user) {
      await logoutFn()
    }
  },
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { t: tokenFromUrl } = Route.useSearch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeToken, setActiveToken] = useState(tokenFromUrl)
  const [resolving, setResolving] = useState(!tokenFromUrl)
  const [stage, setStage] = useState<'form' | 'success'>('form')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tokenFromUrl) {
      saveResetToken(tokenFromUrl)
      window.history.replaceState({}, '', ROUTES.AUTH_RESET_PASSWORD)
    } else {
      setActiveToken(loadResetToken() ?? '')
    }
    setResolving(false)
  }, []) // intentional — run once on mount

  function handleBack() {
    navigate({ to: ROUTES.AUTH_SIGN_IN })
  }

  if (resolving) return null

  if (!activeToken) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center font-sans text-sea-ink">
        <div className="text-center px-6">
          <p className="text-red-500 font-medium mb-4">
            {t('auth.noTokenError')}
          </p>
          <a
            href={ROUTES.AUTH_SIGN_IN}
            className="text-lagoon-deep font-bold underline"
          >
            {t('auth.backToSignIn')}
          </a>
        </div>
      </div>
    )
  }

  async function handleSubmit(newPassword: string) {
    setError(null)
    setLoading(true)
    try {
      await resetPasswordFn({ data: { token: activeToken, newPassword } })
      clearResetToken()
      setStage('success')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (stage === 'success') {
    return (
      <>
        <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
          <MobileResetSuccess onBack={handleBack} />
        </div>
        <div className="hidden md:block w-full min-h-screen font-sans text-sea-ink">
          <DesktopResetSuccess onBack={handleBack} />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileResetPassword
          onSubmit={handleSubmit}
          onBack={handleBack}
          error={error}
          loading={loading}
        />
      </div>
      <div className="hidden md:block w-full min-h-screen font-sans text-sea-ink">
        <DesktopResetPassword
          onSubmit={handleSubmit}
          onBack={handleBack}
          error={error}
          loading={loading}
        />
      </div>
    </>
  )
}
