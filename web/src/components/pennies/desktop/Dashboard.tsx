import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { Expense, CatBreakdownItem } from '#/lib/pennies'
import {
  formatVnd,
  monthShort,
  monthLabel,
  periodSummary,
  catBreakdown,
  getPrevMonth,
} from '#/lib/pennies'
import { useCategories } from '#/hooks/useCategories'
import { ROUTES, SORT, FILTER } from '#/lib/constants'

interface DashboardProps {
  expenses: Expense[]
}

// ── Trend chip ───────────────────────────────────────────────────────────────
function TrendChip({ delta, vs }: { delta: number | null; vs: string }) {
  if (delta === null || delta === undefined) return null
  const down = delta <= 0
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-p-sm px-2.5 py-1.5 font-bold text-[13px] leading-none"
      style={
        down
          ? { background: '#d6f5d6', color: 'var(--palm, #2f6a4a)' }
          : { background: 'var(--danger-soft)', color: 'var(--danger)' }
      }
    >
      <span>{down ? '↓' : '↑'} {Math.abs(delta)}%</span>
      <span className="opacity-70 font-medium">vs {vs}</span>
    </span>
  )
}

// ── Period tile ──────────────────────────────────────────────────────────────
function PeriodTile({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children?: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-p-md p-5 shadow-card min-h-[120px] flex flex-col">
      <p className="font-medium text-[13px] leading-none text-sea-ink-soft m-0">{label}</p>
      <p className="mt-3 font-bold text-[30px] leading-none text-sea-ink tabular-nums m-0">{value}</p>
      <div className="mt-auto pt-4">{children}</div>
    </div>
  )
}

// ── Category breakdown bar + legend ─────────────────────────────────────────
function CategoryBreakdown({ items }: { items: CatBreakdownItem[] }) {
  const { t } = useTranslation()

  if (items.length === 0) {
    return (
      <p className="py-6 text-center font-medium text-[14px] leading-none text-sea-ink-muted m-0">
        {t('dashboard.noSpendingThisMonth')}
      </p>
    )
  }

  return (
    <>
      {/* Proportional bar */}
      <div className="flex h-3.5 rounded-full overflow-hidden bg-sand">
        {items.map((b, i) => (
          <div
            key={b.cat}
            style={{
              width: `${(b.pct * 100).toFixed(2)}%`,
              background: b.dot,
              boxShadow: i < items.length - 1 ? 'inset -2px 0 0 #fff' : 'none',
            }}
          />
        ))}
      </div>

      {/* Legend grid */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-4 mt-6">
        {items.map((b) => (
          <div key={b.cat} className="flex items-center gap-3">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-[14px] leading-none shrink-0"
              style={{ background: b.dot }}
            >
              {b.emoji}
            </span>
            <span className="font-bold text-[14px] leading-none text-sea-ink">{b.name}</span>
            <span className="flex-1" />
            <span className="font-bold text-[14px] leading-none text-sea-ink tabular-nums">
              {formatVnd(b.amount)}
            </span>
            <span className="font-medium text-[12px] leading-none text-sea-ink-muted tabular-nums w-9 text-right">
              {Math.round(b.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Dashboard({ expenses }: DashboardProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const categories = useCategories()

  const P = periodSummary(expenses)
  const monthExp = expenses.filter((e) => e.date.slice(0, 7) === P.monthKey)
  const breakdown = catBreakdown(monthExp, categories)

  const prevKey   = getPrevMonth(P.monthKey)
  const prevTotal = expenses
    .filter((e) => e.date.slice(0, 7) === prevKey)
    .reduce((s, e) => s + e.amount, 0)
  const monthDelta =
    prevTotal !== 0
      ? Math.round(
          (Math.abs(P.month) - Math.abs(prevTotal)) / Math.abs(prevTotal) * 100,
        )
      : null

  const avgMo =
    P.yearMonths > 0
      ? -Math.round(Math.abs(P.year) / P.yearMonths / 1000) * 1000
      : 0

  const monthName      = monthLabel(P.monthKey, i18n.language)
  const monthShortName = monthShort(P.monthKey, i18n.language)
  const prevShort      = monthShort(prevKey,    i18n.language)

  const niceDate = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long', month: 'long', day: 'numeric',
  }).format(new Date())

  function countLabel(n: number) {
    return `${n} ${n === 1 ? t('dashboard.expense') : t('dashboard.expenses')}`
  }

  return (
    <div>
      {/* ── Month hero band ─────────────────────────────────────────── */}
      <div className="bg-white px-12 pt-9 pb-[72px]">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-[11px] leading-none text-sea-ink-soft uppercase tracking-[0.09em] m-0">
              {t('dashboard.thisMonth')} · {monthName}
            </p>
            <div className="flex items-baseline gap-4 mt-3.5">
              <p className="font-display font-bold text-[46px] leading-none tracking-[-0.015em] text-sea-ink tabular-nums m-0">
                {formatVnd(P.month)}
              </p>
              <TrendChip delta={monthDelta} vs={prevShort} />
            </div>
            <p className="mt-3.5 font-medium text-[13px] leading-none text-sea-ink-soft m-0">
              {P.monthCount} {P.monthCount === 1 ? t('dashboard.expense') : t('dashboard.expenses')} {t('dashboard.soFarThisMonth')}
            </p>
          </div>

          <div className="text-right pt-1">
            <p className="font-bold text-[12px] leading-none text-lagoon-deep uppercase tracking-[0.06em] m-0">
              {t('dashboard.today')}
            </p>
            <p className="mt-2.5 font-bold text-[16px] leading-none text-sea-ink m-0">{niceDate}</p>
          </div>
        </div>
      </div>

      {/* ── Three period tiles — overlap the hero ───────────────────── */}
      <div className="grid grid-cols-3 gap-4 px-12 -mt-14 relative">
        <PeriodTile label={t('dashboard.today')} value={formatVnd(P.today)}>
          <span className="font-medium text-[13px] leading-none text-sea-ink-soft">
            {countLabel(P.todayCount)}
          </span>
        </PeriodTile>

        <PeriodTile label={t('dashboard.thisWeek')} value={formatVnd(P.week)}>
          {P.weekDelta !== null ? (
            <TrendChip delta={P.weekDelta} vs={t('dashboard.vsLastWeekShort')} />
          ) : (
            <span className="font-medium text-[13px] leading-none text-sea-ink-soft">
              {countLabel(P.weekCount)}
            </span>
          )}
        </PeriodTile>

        <PeriodTile label={t('dashboard.thisYear')} value={formatVnd(P.year)}>
          <span className="font-medium text-[13px] leading-none text-lagoon-deep tabular-nums">
            {t('dashboard.avgPerMonthValue', { value: formatVnd(avgMo) })}
          </span>
        </PeriodTile>
      </div>

      {/* ── Category breakdown ──────────────────────────────────────── */}
      <div className="px-12 pt-9 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="m-0 font-bold text-[18px] leading-none text-sea-ink">
            {t('dashboard.whereItWent', { month: monthShortName })}
          </h3>
          <button
            type="button"
            onClick={() =>
              navigate({ to: ROUTES.EXPENSES, search: { filter: FILTER.ALL, sort: SORT.DATE } })
            }
            className="font-medium text-[13px] leading-none text-lagoon-deep hover:text-sea-ink bg-transparent border-0 cursor-pointer p-0"
          >
            {t('dashboard.seeAll')}
          </button>
        </div>

        <div className="bg-white rounded-p-md p-6 shadow-card">
          <CategoryBreakdown items={breakdown} />
        </div>
      </div>
    </div>
  )
}
