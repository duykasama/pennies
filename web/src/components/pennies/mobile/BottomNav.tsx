import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ROUTES, FILTER, SORT } from '#/lib/constants'

const tabBase =
  'flex flex-col items-center gap-1 p-0 text-[11px] leading-none no-underline font-sans'

export default function BottomNav() {
  const { t } = useTranslation()

  return (
    <div className="absolute inset-x-0 bottom-0 h-14 bg-white flex items-center gap-6 px-[22px] shadow-[0_-1px_0_rgba(23,58,64,0.04)] z-10">
      <Link
        to={ROUTES.DASHBOARD}
        activeOptions={{ exact: true }}
        activeProps={{ className: `${tabBase} font-bold text-lagoon` }}
        inactiveProps={{
          className: `${tabBase} font-medium text-sea-ink-soft`,
        }}
      >
        <span className="text-[18px] leading-none">🏠</span>
        <span>{t('bottomNav.home')}</span>
      </Link>

      <Link
        to={ROUTES.EXPENSES}
        search={{ filter: FILTER.ALL, sort: SORT.DATE }}
        activeProps={{ className: `${tabBase} font-bold text-lagoon` }}
        inactiveProps={{
          className: `${tabBase} font-medium text-sea-ink-soft`,
        }}
      >
        <span className="text-[18px] leading-none">📋</span>
        <span>{t('bottomNav.expenses')}</span>
      </Link>

      <Link
        to={ROUTES.EXPENSES_ADD}
        className="absolute right-[18px] bottom-8 w-11 h-11 rounded-full bg-lagoon hover:bg-lagoon-deep text-white font-bold text-[24px] shadow-fab cursor-pointer transition-all active:scale-[0.96] flex items-center justify-center leading-none no-underline"
      >
        +
      </Link>
    </div>
  )
}
