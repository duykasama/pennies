import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthHeader, GlyphCircle, PrimaryBtn, mobileInputCls } from './shared'

interface FormProps {
  onSubmit: (newPassword: string) => void
  onBack: () => void
  error: string | null
  loading: boolean
}

export function MobileResetPassword({ onSubmit, onBack, error, loading }: FormProps) {
  const { t } = useTranslation()
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [newPwError, setNewPwError] = useState<string | null>(null)
  const [confirmPwError, setConfirmPwError] = useState<string | null>(null)

  function handleSubmit() {
    let valid = true
    if (newPw.length < 8) {
      setNewPwError(t('auth.resetPasswordMinLength'))
      valid = false
    } else {
      setNewPwError(null)
    }
    if (newPw !== confirmPw) {
      setConfirmPwError(t('auth.resetPasswordMismatch'))
      valid = false
    } else {
      setConfirmPwError(null)
    }
    if (valid) onSubmit(newPw)
  }

  return (
    <div className="absolute inset-0 overflow-y-auto bg-bg-base">
      <AuthHeader title={t('auth.resetTitle')} sub={t('auth.resetSub')} />
      <div className="mx-4 bg-white rounded-p-xl p-5 shadow-card">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
          <div className="mb-4">
            <label className="block font-sans font-bold text-[12px] leading-none text-sea-ink-soft mb-2">
              {t('auth.resetNewPassword')}
            </label>
            <input
              type="password"
              className={`${mobileInputCls} ${newPwError ? 'bg-danger-soft border-danger text-danger' : ''}`}
              value={newPw}
              onChange={(e) => {
                setNewPw(e.target.value)
                if (newPwError) setNewPwError(null)
              }}
              placeholder={t('auth.passwordPlaceholder')}
            />
            {newPwError ? (
              <span className="block mt-1.5 font-sans font-medium text-[11px] leading-tight text-danger">
                {newPwError}
              </span>
            ) : (
              <span className="block mt-1.5 font-sans font-medium text-[11px] leading-snug text-sea-ink-soft">
                {t('auth.resetPasswordMinLength')}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-sans font-bold text-[12px] leading-none text-sea-ink-soft mb-2">
              {t('auth.resetConfirmPassword')}
            </label>
            <input
              type="password"
              className={`${mobileInputCls} ${confirmPwError ? 'bg-danger-soft border-danger text-danger' : ''}`}
              value={confirmPw}
              onChange={(e) => {
                setConfirmPw(e.target.value)
                if (confirmPwError) setConfirmPwError(null)
              }}
              placeholder={t('auth.resetConfirmPlaceholder')}
            />
            {confirmPwError && (
              <span className="block mt-1.5 font-sans font-medium text-[11px] leading-tight text-danger">
                {confirmPwError}
              </span>
            )}
          </div>

          {error && <p className="text-red-500 text-[13px] font-medium mb-2">{error}</p>}

          <div className="mt-1">
            <PrimaryBtn type="submit" disabled={loading}>
              {t('auth.resetBtn')}
            </PrimaryBtn>
          </div>
        </form>
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

interface SuccessProps {
  onBack: () => void
}

export function MobileResetSuccess({ onBack }: SuccessProps) {
  const { t } = useTranslation()

  return (
    <div className="absolute inset-0 overflow-y-auto bg-bg-base flex flex-col items-center px-6 pt-16 text-center">
      <GlyphCircle>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
          <rect x="13" y="25" width="30" height="21" rx="4" stroke="#fff" strokeWidth="2.5" />
          <path d="M19 25v-5a9 9 0 0 1 18 0v5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M24 35l3 3 6-7"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </GlyphCircle>
      <h2 className="mt-7 mb-2 font-sans font-bold text-[24px] leading-tight text-sea-ink">
        {t('auth.resetSuccessTitle')}
      </h2>
      <p className="m-0 font-sans font-medium text-[14px] leading-relaxed text-sea-ink-soft max-w-[280px]">
        {t('auth.resetSuccessSub')}
      </p>
      <div className="w-full max-w-[280px] mt-9">
        <PrimaryBtn onClick={onBack}>{t('auth.backToSignInArrow')}</PrimaryBtn>
      </div>
    </div>
  )
}
