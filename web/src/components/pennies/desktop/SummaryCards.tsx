import { useTranslation } from 'react-i18next'
import { formatVnd, CAT_BY_ID, daysElapsed, calcMonthTotal, calcTopCategory, expenseMonth } from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'

interface SummaryCardsProps {
  expenses: Expense[]
  month: string
}

interface SummaryTileProps {
  label: string
  value: string
  sub?: string
  subColor?: string
}

function SummaryTile({ label, value, sub, subColor = 'text-lagoon-deep' }: SummaryTileProps) {
  return (
    <div className="bg-white rounded-p-md p-5 shadow-card min-h-[104px] flex flex-col gap-2">
      <p className="font-medium text-[12px] leading-none text-sea-ink-soft">{label}</p>
      <p className="font-bold text-[28px] leading-none text-sea-ink tabular-nums">{value}</p>
      {sub && <p className={`font-medium text-[12px] leading-none ${subColor}`}>{sub}</p>}
    </div>
  )
}

export default function SummaryCards({ expenses, month }: SummaryCardsProps) {
  const { t } = useTranslation()

  const inMonth = expenses.filter((e) => expenseMonth(e) === month)
  const total = inMonth.reduce((s, e) => s + e.amount, 0)
  const days = daysElapsed(month)
  const dailyAvg = inMonth.length ? -Math.round(Math.abs(total) / days / 1000) * 1000 : 0

  const top = calcTopCategory(expenses, month)
  const topCat = top ? CAT_BY_ID[top.cat] : null

  return (
    <div className="grid grid-cols-3 gap-4 px-12 -mt-14 relative">
      <SummaryTile
        label={t('dashboard.totalSpent')}
        value={formatVnd(total)}
        sub={`${inMonth.length} ${t('dashboard.expenses')}`}
      />
      <SummaryTile
        label={t('dashboard.dailyAverage')}
        value={formatVnd(dailyAvg)}
        sub={t('dashboard.overDays', { count: days })}
      />
      {/* Top category — custom layout */}
      <div className="bg-white rounded-p-md p-5 shadow-card min-h-[104px] flex flex-col gap-2">
        <p className="font-medium text-[12px] leading-none text-sea-ink-soft">{t('dashboard.topCategory')}</p>
        {topCat ? (
          <>
            <div className="flex items-center gap-2.5">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-[16px] leading-none"
                style={{ background: topCat.dot }}
              >
                {topCat.emoji}
              </span>
              <span className="font-bold text-[22px] leading-none text-sea-ink">{topCat.label}</span>
            </div>
            <p className="font-medium text-[12px] leading-none text-lagoon-deep tabular-nums">
              {formatVnd(top!.amount)}
            </p>
          </>
        ) : (
          <p className="font-bold text-[22px] leading-none text-sea-ink-muted">—</p>
        )}
      </div>
    </div>
  )
}
