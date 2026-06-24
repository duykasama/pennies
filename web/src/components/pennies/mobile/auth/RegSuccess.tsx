import { useTranslation } from 'react-i18next'
import { PrimaryBtn, GlyphCircle } from './shared'

interface Props {
  email?: string
  onContinue: () => void
}

export default function MobileRegSuccess({
  email = 'alex@example.com',
  onContinue,
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="absolute inset-0 overflow-y-auto bg-bg-base flex flex-col items-center px-6 pt-16 text-center">
      <GlyphCircle>
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M14 28l10 10 18-22"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </GlyphCircle>
      <h2 className="mt-7 mb-2 font-sans font-bold text-[24px] leading-tight text-sea-ink">
        {t('auth.verified')}
      </h2>
      <p className="m-0 font-sans font-medium text-[14px] leading-relaxed text-sea-ink-soft max-w-[280px]">
        {t('auth.verifiedSub')}
      </p>
      <div className="w-full max-w-[280px] mt-9">
        <PrimaryBtn onClick={onContinue}>{t('auth.goToPennies')}</PrimaryBtn>
      </div>
      <div className="mt-5 font-sans font-medium text-[11px] text-sea-ink-muted">
        {t('auth.welcomeAboard')} · {email}
      </div>
    </div>
  )
}
