import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '#/lib/constants'
import LanguagePicker from '#/components/pennies/LanguagePicker'
import ThemePicker from '#/components/pennies/ThemePicker'

const linkBase = 'p-0 text-[14px] no-underline font-sans cursor-pointer'

export default function TopNav() {
  const { t } = useTranslation()

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
    </nav>
  )
}
