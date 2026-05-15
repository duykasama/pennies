import { useTranslation } from 'react-i18next'
import { CelebrateShell, DesktopPrimaryBtn } from './shared'

interface Props {
  email: string
  onResend: () => void
  onUseDifferent: () => void
}

export default function DesktopCheckEmail({ email, onResend, onUseDifferent }: Props) {
  const { t } = useTranslation()

  return (
    <CelebrateShell
      glyph={
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <rect x="10" y="16" width="44" height="32" rx="3" stroke="#fff" strokeWidth="3" />
          <path d="M10 20l22 16 22-16" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
      title={t('auth.checkEmail')}
      sub={
        <>
          {t('auth.checkEmailSub')} <strong className="text-sea-ink font-bold">{email}</strong>.{' '}
          {t('auth.clickToConfirm')}
        </>
      }
    >
      <div className="w-full flex flex-col gap-3">
        <DesktopPrimaryBtn>{t('auth.openMailApp')}</DesktopPrimaryBtn>
        <button
          type="button"
          onClick={onResend}
          className="bg-transparent border-0 text-lagoon-deep font-sans font-bold text-[13px] cursor-pointer h-10"
        >
          {t('auth.resend')}
        </button>
      </div>
      <button
        type="button"
        onClick={onUseDifferent}
        className="mt-7 bg-transparent border-0 text-sea-ink-soft font-sans font-medium text-[12px] cursor-pointer underline underline-offset-2 decoration-1"
      >
        {t('auth.useDifferentEmail')}
      </button>
    </CelebrateShell>
  )
}
