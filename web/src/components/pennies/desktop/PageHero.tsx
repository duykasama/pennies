import { useTranslation } from 'react-i18next'

export default function PageHero() {
  const { t } = useTranslation()

  return (
    <div className="h-[120px] bg-white flex flex-col items-center justify-center">
      <p className="font-display font-bold text-[40px] leading-none tracking-[-0.015em] text-sea-ink">
        {t('appName')}
      </p>
      <p className="mt-2.5 font-medium text-[15px] leading-none text-sea-ink-soft">
        {t('appTagline')}
      </p>
    </div>
  )
}
