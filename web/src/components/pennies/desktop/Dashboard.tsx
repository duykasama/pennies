import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { Expense } from '#/lib/pennies'
import { ROUTES } from '#/lib/constants'
import PageHero from '#/components/pennies/desktop/PageHero'
import SummaryCards from '#/components/pennies/desktop/SummaryCards'
import RecentList from '#/components/pennies/desktop/RecentList'

interface DashboardProps {
  expenses: Expense[]
}

export default function Dashboard({ expenses }: DashboardProps) {
  const { t } = useTranslation()

  return (
    <div>
      <PageHero />
      <SummaryCards expenses={expenses} />
      <div className="px-12 pt-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[18px] text-sea-ink m-0">{t('dashboard.recentExpenses')}</h3>
          <Link to={ROUTES.EXPENSES} className="font-medium text-[13px] text-lagoon-deep no-underline">
            {t('dashboard.viewAll')}
          </Link>
        </div>
        <RecentList expenses={expenses} />
      </div>
    </div>
  )
}
