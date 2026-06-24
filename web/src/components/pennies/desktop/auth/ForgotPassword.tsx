import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthShell, DesktopField, DesktopPrimaryBtn } from './shared'

interface Props {
  onSubmit: (email: string) => void
  onBack: () => void
  error?: string | null
  loading?: boolean
}

export default function DesktopForgotPassword({
  onSubmit,
  onBack,
  error,
  loading,
}: Props) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')

  return (
    <AuthShell
      title={t('auth.forgotTitle')}
      sub={t('auth.forgotSub')}
      footer={
        <button
          type="button"
          onClick={onBack}
          className="bg-transparent border-0 text-lagoon-deep font-bold text-[13px] cursor-pointer p-0"
        >
          {t('auth.backToSignIn')}
        </button>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(email)
        }}
      >
        <DesktopField
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.emailPlaceholder')}
        />
        {error && (
          <p className="text-red-500 text-[13px] font-medium mb-2">{error}</p>
        )}
        <DesktopPrimaryBtn type="submit" disabled={loading}>
          {t('auth.continueBtn')}
        </DesktopPrimaryBtn>
      </form>
    </AuthShell>
  )
}
