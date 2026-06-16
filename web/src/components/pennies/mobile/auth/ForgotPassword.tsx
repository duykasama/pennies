import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthHeader, AuthInput, PrimaryBtn } from './shared'

interface Props {
  onSubmit: (email: string) => void
  onBack: () => void
  error?: string | null
  loading?: boolean
}

export default function MobileForgotPassword({ onSubmit, onBack, error, loading }: Props) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')

  return (
    <div className="absolute inset-0 overflow-y-auto bg-bg-base">
      <div className="px-5 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="bg-transparent border-0 text-lagoon-deep font-sans font-medium text-[14px] cursor-pointer p-0"
        >
          {t('addExpense.back')}
        </button>
      </div>
      <AuthHeader title={t('auth.forgotTitle')} sub={t('auth.forgotSub')} />
      <div className="mx-4 bg-white rounded-p-xl p-5 shadow-card">
        <AuthInput
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.emailPlaceholder')}
        />
        {error && <p className="text-red-500 text-[13px] font-medium mt-2">{error}</p>}
        <div className="mt-1">
          <PrimaryBtn onClick={() => onSubmit(email)} disabled={loading}>{t('auth.continueBtn')}</PrimaryBtn>
        </div>
      </div>
      <div className="text-center py-5 font-sans font-medium text-[13px] text-sea-ink-soft">
        {t('auth.rememberedIt')}{' '}
        <button
          type="button"
          onClick={onBack}
          className="text-lagoon-deep font-bold bg-transparent border-0 cursor-pointer p-0"
        >
          {t('auth.backToSignIn')}
        </button>
      </div>
    </div>
  )
}
