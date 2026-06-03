import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ROUTES, FILTER, SORT } from '#/lib/constants'
import { logoutFn } from '#/lib/auth'
import LanguagePicker from '#/components/pennies/LanguagePicker'
import ThemePicker from '#/components/pennies/ThemePicker'

const linkBase = 'p-0 text-[14px] no-underline font-sans cursor-pointer'

export default function TopNav() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <nav className="h-[60px] bg-sea-ink text-white flex items-center px-12 gap-[22px]">
      <span className="font-display font-bold text-[24px] tracking-[-0.015em] pr-[10px] mr-1.5 border-r border-white/15 leading-none">
        {t('appName')}
      </span>

      <Link
        to={ROUTES.DASHBOARD}
        activeOptions={{ exact: true }}
        activeProps={{ className: `${linkBase} font-bold text-white` }}
        inactiveProps={{ className: `${linkBase} font-medium text-white/55 hover:text-lagoon-mist` }}
      >
        {t('nav.dashboard')}
      </Link>

      <Link
        to={ROUTES.EXPENSES}
        search={{ filter: FILTER.ALL, sort: SORT.DATE }}
        activeProps={{ className: `${linkBase} font-bold text-white` }}
        inactiveProps={{ className: `${linkBase} font-medium text-white/55 hover:text-lagoon-mist` }}
      >
        {t('nav.expenses')}
      </Link>

      <div className="flex-1" />
      <ThemePicker variant="topnav" />
      <LanguagePicker variant="topnav" />

      <Link
        to={ROUTES.EXPENSES_ADD}
        className="h-9 px-[18px] bg-lagoon hover:bg-lagoon-deep text-white rounded-p-sm font-bold text-[13px] cursor-pointer transition-colors no-underline inline-flex items-center font-sans"
      >
        {t('nav.addExpense')}
      </Link>

      <button
        onClick={async () => {
          await logoutFn()
          navigate({ to: ROUTES.AUTH_SIGN_IN })
        }}
        className="h-9 px-[18px] border border-white/30 hover:bg-white/10 text-white rounded-p-sm font-bold text-[13px] cursor-pointer transition-colors font-sans"
      >
        {t('nav.logout')}
      </button>
    </nav>
  )
}
