import { useTranslation } from 'react-i18next'
import { formatVnd } from '#/lib/pennies'
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
      <p className="font-medium text-[12px] leading-none text-sea-ink-soft">{label}</p>
      <p className="font-bold text-[28px] leading-none text-sea-ink tabular-nums">
        {formatVnd(amount)}
      </p>
      <p className="font-medium text-[12px] leading-none text-lagoon-deep">{sub}</p>
    </div>
  )
}

export default function SummaryCards({ expenses }: SummaryCardsProps) {
  const { t } = useTranslation()

  const todayExpenses = expenses.filter((e) => e.date === 'today')
  const todayTotal = todayExpenses.reduce((s, e) => s + e.amount, 0)
  const weekTotal = expenses.reduce((s, e) => s + e.amount, 0)
  const monthTotal = weekTotal * 4

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
        sub={t('dashboard.vsLastWeek')}
      />
      <SummaryTile
        label={t('dashboard.thisMonth')}
        amount={monthTotal}
        sub={t('dashboard.onTrack')}
      />
    </div>
  )
}
