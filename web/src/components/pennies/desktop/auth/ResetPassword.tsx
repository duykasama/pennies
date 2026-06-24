import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AuthShell,
  CelebrateShell,
  DesktopPrimaryBtn,
  desktopInputCls,
} from './shared'

interface FormProps {
  onSubmit: (newPassword: string) => void
  onBack: () => void
  error: string | null
  loading: boolean
}

export function DesktopResetPassword({
  onSubmit,
  onBack,
  error,
  loading,
}: FormProps) {
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
    <AuthShell
      title={t('auth.resetTitle')}
      sub={t('auth.resetSub')}
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
          handleSubmit()
        }}
      >
        <div className="mb-4">
          <label className="block font-sans font-bold text-[13px] leading-none text-sea-ink mb-2">
            {t('auth.resetNewPassword')}
          </label>
          <input
            type="password"
            className={`${desktopInputCls} ${newPwError ? 'bg-danger-soft border-danger text-danger' : ''}`}
            value={newPw}
            onChange={(e) => {
              setNewPw(e.target.value)
              if (newPwError) setNewPwError(null)
            }}
            placeholder={t('auth.passwordPlaceholder')}
          />
          {newPwError ? (
            <p className="mt-1.5 font-sans font-medium text-[12px] text-danger">
              {newPwError}
            </p>
          ) : (
            <p className="mt-1.5 font-sans font-medium text-[12px] text-sea-ink-soft">
              {t('auth.resetPasswordMinLength')}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-sans font-bold text-[13px] leading-none text-sea-ink mb-2">
            {t('auth.resetConfirmPassword')}
          </label>
          <input
            type="password"
            className={`${desktopInputCls} ${confirmPwError ? 'bg-danger-soft border-danger text-danger' : ''}`}
            value={confirmPw}
            onChange={(e) => {
              setConfirmPw(e.target.value)
              if (confirmPwError) setConfirmPwError(null)
            }}
            placeholder={t('auth.resetConfirmPlaceholder')}
          />
          {confirmPwError && (
            <p className="mt-1.5 font-sans font-medium text-[12px] text-danger">
              {confirmPwError}
            </p>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-[13px] font-medium mb-2">{error}</p>
        )}

        <DesktopPrimaryBtn type="submit" disabled={loading}>
          {t('auth.resetBtn')}
        </DesktopPrimaryBtn>
      </form>
    </AuthShell>
  )
}

interface SuccessProps {
  onBack: () => void
}

export function DesktopResetSuccess({ onBack }: SuccessProps) {
  const { t } = useTranslation()

  return (
    <CelebrateShell
      glyph={
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="15"
            y="29"
            width="34"
            height="24"
            rx="4.5"
            stroke="#fff"
            strokeWidth="3"
          />
          <path
            d="M22 29v-6a10 10 0 0 1 20 0v6"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M27 40l4 4 7-8"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      }
      title={t('auth.resetSuccessTitle')}
      sub={t('auth.resetSuccessSub')}
    >
      <div className="w-full">
        <DesktopPrimaryBtn onClick={onBack}>
          {t('auth.backToSignInArrow')}
        </DesktopPrimaryBtn>
      </div>
    </CelebrateShell>
  )
}
