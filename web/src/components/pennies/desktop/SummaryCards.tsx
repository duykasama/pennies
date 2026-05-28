import { useTranslation } from 'react-i18next'
import {
  formatVnd,
  isoToday,
  isoStartOfWeek,
  isoStartOfMonth,
} from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'

interface SummaryCardsProps {
  expenses: Expense[]
}

interface SummaryTileProps {
  label: string
  amount: number
  sub: string
}

function SummaryTile({ label, amount, sub }: SummaryTileProps) {
  return (
    <div className="bg-white rounded-p-md p-5 shadow-card min-h-[96px] flex flex-col gap-2">
      <p className="font-medium text-[12px] leading-none text-sea-ink-soft">
        {label}
      </p>
      <p className="font-bold text-[28px] leading-none text-sea-ink tabular-nums">
        {formatVnd(amount)}
      </p>
      <p className="font-medium text-[12px] leading-none text-lagoon-deep">
        {sub}
      </p>
    </div>
  )
}

function weekVsLabel(current: number, last: number, suffix: string): string {
  if (current === 0 && last === 0) return `= ${suffix}`
  if (last === 0) return `↑ ${suffix}`
  const pct = Math.round(((current - last) / last) * 100)
  if (pct === 0) return `= ${suffix}`
  return pct > 0 ? `↑ ${pct}% ${suffix}` : `↓ ${Math.abs(pct)}% ${suffix}`
}

export default function SummaryCards({ expenses }: SummaryCardsProps) {
  const { t } = useTranslation()

  const today = isoToday()
  const weekStart = isoStartOfWeek()
  const monthStart = isoStartOfMonth()

  const lastWeekEndDate = new Date(weekStart)
  lastWeekEndDate.setDate(lastWeekEndDate.getDate() - 1)
  const lastWeekEnd = lastWeekEndDate.toISOString().slice(0, 10)

  const lastWeekStartDate = new Date(weekStart)
  lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7)
  const lastWeekStart = lastWeekStartDate.toISOString().slice(0, 10)

  const todayExpenses = expenses.filter((e) => e.date === today)
  const weekExpenses = expenses.filter(
    (e) => e.date >= weekStart && e.date <= today,
  )
  const lastWeekExpenses = expenses.filter(
    (e) => e.date >= lastWeekStart && e.date <= lastWeekEnd,
  )
  const monthExpenses = expenses.filter(
    (e) => e.date >= monthStart && e.date <= today,
  )

  const todayTotal = todayExpenses.reduce((s, e) => s + e.amount, 0)
  const weekTotal = weekExpenses.reduce((s, e) => s + e.amount, 0)
  const lastWeekTotal = lastWeekExpenses.reduce((s, e) => s + e.amount, 0)
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="grid grid-cols-3 gap-4 px-12 -mt-14 relative">
      <SummaryTile
        label={t('dashboard.today')}
        amount={todayTotal}
        sub={`${todayExpenses.length} ${t('dashboard.expenses')}`}
      />
      <SummaryTile
        label={t('dashboard.thisWeek')}
        amount={weekTotal}
        sub={weekVsLabel(weekTotal, lastWeekTotal, t('dashboard.vsLastWeek'))}
      />
      <SummaryTile
        label={t('dashboard.thisMonth')}
        amount={monthTotal}
        sub={t('dashboard.onTrack')}
      />
    </div>
  )
}
