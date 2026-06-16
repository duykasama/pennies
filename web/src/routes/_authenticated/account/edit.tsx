import { createFileRoute, getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { ROUTES } from '#/lib/constants'
import { updateAccountFn, requestEmailUpdateFn, confirmEmailUpdateFn } from '#/lib/auth'
import TopNav from '#/components/pennies/desktop/TopNav'
import DesktopAccountEdit from '#/components/pennies/desktop/account/AccountEdit'
import MobileAccountEdit from '#/components/pennies/mobile/account/AccountEdit'

export const Route = createFileRoute('/_authenticated/account/edit')({
  component: AccountEditPage,
})

const accountRoute = getRouteApi('/_authenticated/account')

function AccountEditPage() {
  const profile = accountRoute.useLoaderData()
  const navigate = useNavigate()
  const router = useRouter()
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  async function handleSaveName(displayName: string) {
    setNameError(null)
    try {
      await updateAccountFn({ data: { displayName } })
    } catch (e) {
      setNameError(e instanceof Error ? e.message : 'Save failed')
      throw e
    }
  }

  async function handleRequestEmail(email: string) {
    setEmailError(null)
    try {
      await requestEmailUpdateFn({ data: { email } })
    } catch (e) {
      setEmailError(e instanceof Error ? e.message : 'Save failed')
      throw e
    }
  }

  async function handleConfirmEmail(code: string) {
    setEmailError(null)
    try {
      await confirmEmailUpdateFn({ data: { code } })
      await router.invalidate()
    } catch (e) {
      setEmailError(e instanceof Error ? e.message : 'Save failed')
      throw e
    }
  }

  function handleCancel() {
    navigate({ to: ROUTES.ACCOUNT })
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Mobile */}
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <MobileAccountEdit
          user={profile}
          onCancel={handleCancel}
          onSaveName={handleSaveName}
          onRequestEmail={handleRequestEmail}
          onConfirmEmail={handleConfirmEmail}
          nameError={nameError}
          emailError={emailError}
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:block w-full min-h-screen bg-bg-base font-sans text-sea-ink">
        <TopNav />
        <DesktopAccountEdit
          user={profile}
          onCancel={handleCancel}
          onSaveName={handleSaveName}
          onRequestEmail={handleRequestEmail}
          onConfirmEmail={handleConfirmEmail}
          nameError={nameError}
          emailError={emailError}
        />
      </div>
    </div>
  )
}
