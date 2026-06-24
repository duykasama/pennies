import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ROUTES } from '#/lib/constants'
import { changePasswordFn } from '#/lib/auth'
import TopNav from '#/components/pennies/desktop/TopNav'
import DesktopAccountPassword from '#/components/pennies/desktop/account/AccountPassword'
import MobileAccountPassword from '#/components/pennies/mobile/account/AccountPassword'

export const Route = createFileRoute('/_authenticated/account/password')({
  component: AccountPasswordPage,
})

function AccountPasswordPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  async function handleSave(data: { current: string; next: string }) {
    setError(null)
    try {
      await changePasswordFn({ data })
      navigate({ to: ROUTES.ACCOUNT })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  function handleCancel() {
    navigate({ to: ROUTES.ACCOUNT })
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Mobile */}
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileAccountPassword
          onCancel={handleCancel}
          onSave={handleSave}
          error={error}
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:block w-full min-h-screen bg-bg-base font-sans text-sea-ink">
        <TopNav />
        <DesktopAccountPassword
          onCancel={handleCancel}
          onSave={handleSave}
          error={error}
        />
      </div>
    </div>
  )
}
