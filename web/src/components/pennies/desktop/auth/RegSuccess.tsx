import { useTranslation } from 'react-i18next'
import { CelebrateShell, DesktopPrimaryBtn } from './shared'

interface Props {
  email?: string
  onContinue: () => void
}

export default function DesktopRegSuccess({ email = 'alex@example.com', onContinue }: Props) {
  const { t } = useTranslation()

  return (
    <CelebrateShell
      glyph={
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path d="M16 32l12 12 20-26" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
      title={t('auth.verified')}
      sub={t('auth.verifiedSub')}
    >
      <div className="w-full">
        <DesktopPrimaryBtn onClick={onContinue}>{t('auth.goToPennies')}</DesktopPrimaryBtn>
      </div>
      <div className="mt-5 font-sans font-medium text-[12px] text-sea-ink-muted">
        {t('auth.welcomeAboard')} · {email}
      </div>
    </CelebrateShell>
  )
}
