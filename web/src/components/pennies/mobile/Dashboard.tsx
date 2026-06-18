import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { Expense, CatBreakdownItem } from '#/lib/pennies'
import {
  formatVnd,
  monthShort,
  periodSummary,
  catBreakdown,
  getPrevMonth,
} from '#/lib/pennies'
import { useCategories } from '#/hooks/useCategories'
import { ROUTES, SORT, FILTER } from '#/lib/constants'
import Header from '#/components/pennies/mobile/Header'

interface DashboardProps {
  expenses: Expense[]
  onAccount?: () => void
  userInitials?: string
}

// ── Inline delta text ────────────────────────────────────────────────────────
function MODelta({ delta, vs }: { delta: number | null; vs: string }) {
  if (delta === null || delta === undefined) return null
  const down = delta <= 0
  return (
    <span className={`font-bold whitespace-nowrap ${down ? 'text-[#2f6a4a]' : 'text-danger'}`}>
      {down ? '↓' : '↑'} {Math.abs(delta)}%{' '}
      <span className="font-medium text-sea-ink-muted">vs {vs}</span>
    </span>
  )
}

// ── Compact mobile category breakdown ────────────────────────────────────────
function MOCategoryBreakdown({ items }: { items: CatBreakdownItem[] }) {
  const { t } = useTranslation()

  if (items.length === 0) {
    return (
      <p className="py-4 text-center font-medium text-[13px] leading-none text-sea-ink-muted m-0">
        {t('dashboard.noSpendingThisMonth')}
      </p>
    )
  }

  return (
    <>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-sand">
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

      <div className="flex flex-col mt-3">
        {items.map((b) => (
          <div key={b.cat} className="flex items-center gap-2.5 py-2">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] leading-none shrink-0"
              style={{ background: b.dot }}
            >
              {b.emoji}
            </span>
            <span className="font-bold text-[13px] leading-none text-sea-ink">{b.name}</span>
            <span className="flex-1" />
            <span className="font-bold text-[13px] leading-none text-sea-ink tabular-nums">
              {formatVnd(b.amount)}
            </span>
            <span className="font-medium text-[11px] leading-none text-sea-ink-muted tabular-nums w-8 text-right">
              {Math.round(b.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Dashboard({ expenses, onAccount, userInitials }: DashboardProps) {
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

  const monthShortName = monthShort(P.monthKey, i18n.language)
  const prevShort      = monthShort(prevKey,    i18n.language)

  function countLabel(n: number) {
    return `${n} ${n === 1 ? t('dashboard.expense') : t('dashboard.expenses')}`
  }

  return (
    <>
      <Header variant="mark" onAccount={onAccount} userInitials={userInitials} />
      <div className="absolute inset-x-0 top-14 bottom-14 overflow-y-auto">

        {/* ── Month hero ─────────────────────────────────────────────── */}
        <div className="bg-white px-4 pt-5 pb-6 text-center">
          <p className="font-bold text-[11px] leading-none text-sea-ink-soft uppercase tracking-[0.08em] m-0">
            {t('dashboard.thisMonth')} · {monthShortName}
          </p>
          <p className="mt-2.5 font-bold text-[36px] leading-none text-sea-ink tabular-nums m-0">
            {formatVnd(P.month)}
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 font-medium text-[12px] leading-none">
            <span className="text-sea-ink-soft whitespace-nowrap">
              {countLabel(P.monthCount)}
            </span>
            {monthDelta !== null && (
              <>
                <span className="text-sea-ink-muted">·</span>
                <MODelta delta={monthDelta} vs={prevShort} />
              </>
            )}
          </div>
        </div>

        {/* ── Today + This week ──────────────────────────────────────── */}
        <div className="flex gap-3 px-4 pt-4">
          <div className="flex-1 bg-white rounded-p-md p-3.5 shadow-card flex flex-col gap-1.5">
            <p className="font-medium text-[11px] leading-none text-sea-ink-soft m-0">
              {t('dashboard.today')}
            </p>
            <p className="font-bold text-[19px] leading-none text-sea-ink tabular-nums m-0">
              {formatVnd(P.today)}
            </p>
            <p className="font-medium text-[11px] leading-none text-sea-ink-soft m-0">
              {countLabel(P.todayCount)}
            </p>
          </div>

          <div className="flex-1 bg-white rounded-p-md p-3.5 shadow-card flex flex-col gap-1.5">
            <p className="font-medium text-[11px] leading-none text-sea-ink-soft m-0">
              {t('dashboard.thisWeek')}
            </p>
            <p className="font-bold text-[19px] leading-none text-sea-ink tabular-nums m-0">
              {formatVnd(P.week)}
            </p>
            <div className="text-[11px] leading-none">
              {P.weekDelta !== null ? (
                <MODelta delta={P.weekDelta} vs={t('dashboard.vsLastWeekShort')} />
              ) : (
                <span className="font-medium text-sea-ink-soft">{countLabel(P.weekCount)}</span>
              )}
            </div>
          </div>
        </div>

        {/* ── This year — full width ─────────────────────────────────── */}
        <div className="px-4 pt-3">
          <div className="bg-white rounded-p-md p-4 shadow-card flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <p className="font-medium text-[11px] leading-none text-sea-ink-soft m-0">
                {t('dashboard.thisYear')}
              </p>
              <p className="font-bold text-[22px] leading-none text-sea-ink tabular-nums m-0">
                {formatVnd(P.year)}
              </p>
            </div>
            <div className="text-right flex flex-col gap-1.5">
              <p className="font-medium text-[11px] leading-none text-sea-ink-muted m-0">
                {t('dashboard.avgPerMonth')}
              </p>
              <p className="font-bold text-[14px] leading-none text-lagoon-deep tabular-nums m-0">
                {formatVnd(avgMo)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Category breakdown ─────────────────────────────────────── */}
        <div className="px-4 pt-5 pb-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-bold text-[15px] leading-none text-sea-ink">
              {t('dashboard.whereItWent', { month: monthShortName })}
            </span>
            <button
              type="button"
              onClick={() =>
                navigate({ to: ROUTES.EXPENSES, search: { filter: FILTER.ALL, sort: SORT.DATE } })
              }
              className="font-medium text-[12px] leading-none text-lagoon-deep bg-transparent border-0 cursor-pointer p-0"
            >
              {t('dashboard.seeAll')}
            </button>
          </div>

          <div className="bg-white rounded-p-md p-4 shadow-card">
            <MOCategoryBreakdown items={breakdown} />
          </div>
        </div>

      </div>
    </>
  )
}
