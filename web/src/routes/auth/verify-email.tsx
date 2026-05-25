import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ROUTES } from '#/lib/constants'
import { verifyEmailFn } from '#/lib/auth'

export const Route = createFileRoute('/auth/verify-email')({
  validateSearch: (search) => ({
    userId: typeof search.userId === 'string' ? search.userId : '',
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const { userId, token } = Route.useSearch()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !token) {
      setError('Invalid verification link.')
      return
    }
    verifyEmailFn({ data: { userId, token } })
      .then(() => navigate({ to: ROUTES.AUTH_VERIFIED }))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Verification failed'))
  }, [userId, token, navigate])

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center font-sans text-sea-ink">
      {error ? (
        <div className="text-center">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <a href={ROUTES.AUTH_SIGN_IN} className="text-lagoon-deep font-bold underline">
            Back to sign in
          </a>
        </div>
      ) : (
        <p className="text-sea-ink-soft">Verifying your email…</p>
      )}
    </div>
  )
}
