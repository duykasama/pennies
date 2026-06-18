import { useTranslation } from 'react-i18next'
import { PrimaryBtn, GlyphCircle } from './shared'

interface Props {
  email: string
  onOpenMailApp: () => void
  onResend: () => void
  secondsLeft: number
  onUseDifferent: () => void
}

export default function MobileCheckEmail({ email, onOpenMailApp, onResend, secondsLeft, onUseDifferent }: Props) {
  const { t } = useTranslation()

  return (
    <div className="absolute inset-0 overflow-y-auto bg-bg-base flex flex-col items-center px-6 pt-16 text-center">
      <GlyphCircle>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
          <rect x="8" y="14" width="40" height="28" rx="3" stroke="#fff" strokeWidth="2.5" />
          <path d="M8 18l20 14 20-14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </GlyphCircle>
      <h2 className="mt-7 mb-2 font-sans font-bold text-[22px] leading-tight text-sea-ink">
        {t('auth.checkEmail')}
      </h2>
      <p className="m-0 mb-1 font-sans font-medium text-[14px] leading-relaxed text-sea-ink-soft">
        {t('auth.checkEmailSub')}
      </p>
      <p className="m-0 mb-8 font-sans font-bold text-[14px] text-sea-ink">{email}</p>
      <div className="w-full max-w-[280px] flex flex-col gap-3">
        <PrimaryBtn onClick={onOpenMailApp}>{t('auth.openMailApp')}</PrimaryBtn>
        <button
          type="button"
          onClick={onResend}
          disabled={secondsLeft > 0}
          className="bg-transparent border-0 text-lagoon-deep font-sans font-bold text-[13px] cursor-pointer p-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {secondsLeft > 0 ? t('auth.resendIn', { seconds: secondsLeft }) : t('auth.resend')}
        </button>
      </div>
      <button
        type="button"
        onClick={onUseDifferent}
        className="mt-7 bg-transparent border-0 text-sea-ink-soft font-sans font-medium text-[12px] cursor-pointer underline underline-offset-2 decoration-1"
      >
        {t('auth.useDifferentEmail')}
      </button>
    </div>
  )
}
