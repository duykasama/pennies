import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { Expense } from '#/lib/pennies'
import { isoToday, isoStartOfWeek } from '#/lib/pennies'
import { ROUTES } from '#/lib/constants'
import Header from '#/components/pennies/mobile/Header'
import SummaryCard from '#/components/pennies/mobile/SummaryCard'
import ExpenseRow from '#/components/pennies/ExpenseRow'

interface DashboardProps {
  expenses: Expense[]
}

export default function Dashboard({ expenses }: DashboardProps) {
  const { t } = useTranslation()

  const today = isoToday()
  const weekStart = isoStartOfWeek()

  const todayExpenses = expenses.filter((e) => e.date === today)
  const weekExpenses = expenses.filter((e) => e.date >= weekStart && e.date <= today)

  const todayTotal = todayExpenses.reduce((s, e) => s + e.amount, 0)
  const weekTotal = weekExpenses.reduce((s, e) => s + e.amount, 0)

  const recentExpenses = expenses.slice(0, 4)

  return (
    <>
      <Header variant="mark" />
      <div className="absolute inset-x-0 top-14 bottom-14 overflow-y-auto">
        {/* White band hero */}
        <div className="bg-white h-[110px] flex flex-col items-center justify-center">
          <p className="font-display font-bold text-[32px] leading-none tracking-[-0.01em] text-sea-ink">
            {t('appName')}
          </p>
          <p className="mt-2 font-medium text-[14px] leading-none text-sea-ink-soft">
            {t('appTagline')}
          </p>
        </div>

        {/* Summary cards */}
        <div className="flex gap-3 p-4">
          <SummaryCard
            label={t('dashboard.today')}
            amount={todayTotal}
            sub={`${todayExpenses.length} ${t('dashboard.expenses')}`}
          />
          <SummaryCard
            label={t('dashboard.thisWeek')}
            amount={weekTotal}
            sub={t('dashboard.vsLastWeekShort')}
          />
        </div>

        {/* Recent section */}
        <div className="flex items-center justify-between px-4 pb-2">
          <p className="font-bold text-[15px] text-sea-ink">{t('dashboard.recent')}</p>
          <Link to={ROUTES.EXPENSES} className="font-medium text-[12px] text-lagoon-deep no-underline">
            {t('dashboard.viewAll')}
          </Link>
        </div>

        {recentExpenses.map((exp) => (
          <ExpenseRow key={exp.id} expense={exp} variant="mobile" />
        ))}
      </div>
    </>
  )
}
