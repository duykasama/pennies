import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { Expense, CatBreakdownItem, MonthSeriesItem } from '#/lib/pennies'
import {
  formatVnd,
  formatVndShort,
  monthShort,
  periodSummary,
  catBreakdown,
  monthSeries,
  getPrevMonth,
} from '#/lib/pennies'
import { useCategories } from '#/hooks/useCategories'
import { useFrequencies } from '#/hooks/useFrequencies'
import { ROUTES, SORT, FILTER } from '#/lib/constants'
import Header from '#/components/pennies/mobile/Header'

interface DashboardProps {
  expenses: Expense[]
  onAccount?: () => void
  userInitials?: string
}

// ── Inline delta text ────────────────────────────────────────────────────────
function MODelta({ delta, vs }: { delta: number | null; vs: string }) {
  if (delta === null) return null
  const down = delta <= 0
  return (
    <span
      className={`font-bold whitespace-nowrap ${down ? 'text-[#2f6a4a]' : 'text-danger'}`}
    >
      {down ? '↓' : '↑'} {Math.abs(delta)}%{' '}
      <span className="font-medium text-sea-ink-muted">vs {vs}</span>
    </span>
  )
}

// ── Mobile donut chart ────────────────────────────────────────────────────────
function MODonut({
  items,
  size = 150,
  stroke = 26,
}: {
  items: CatBreakdownItem[]
  size?: number
  stroke?: number
}) {
  const r = (size - stroke) / 2
  const c = size / 2
  const circ = 2 * Math.PI * r
  const total = items.reduce((s, b) => s + Math.abs(b.amount), 0) || 1
  let offset = 0
  const segs = items.map((b) => {
    const len = (Math.abs(b.amount) / total) * circ
    const el = (
      <circle
        key={b.cat}
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={b.dot}
        strokeWidth={stroke}
        strokeDasharray={`${len} ${circ - len}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${c} ${c})`}
      />
    )
    offset += len
    return el
  })
  let acc = 0
  const ticks = items.map((b, i) => {
    const ang = (acc / total) * 2 * Math.PI - Math.PI / 2
    acc += Math.abs(b.amount)
    return (
      <line
        key={'t' + i}
        x1={c + (r - stroke / 2) * Math.cos(ang)}
        y1={c + (r - stroke / 2) * Math.sin(ang)}
        x2={c + (r + stroke / 2) * Math.cos(ang)}
        y2={c + (r + stroke / 2) * Math.sin(ang)}
        stroke="white"
        strokeWidth={2.5}
      />
    )
  })
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segs}
      {ticks}
      <text
        x={c}
        y={c}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          font: '700 17px var(--font-body)',
          fill: 'var(--sea-ink)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatVnd(total)}
      </text>
    </svg>
  )
}

// ── Mobile months bar chart ───────────────────────────────────────────────────
function MOMonthsChart({
  data,
  plot = 120,
}: {
  data: MonthSeriesItem[]
  plot?: number
}) {
  const max = Math.max(...data.map((d) => Math.abs(d.total)), 1)
  return (
    <div>
      <div className="flex items-end gap-2.5 pt-5" style={{ height: plot }}>
        {data.map((d) => {
          const mag = Math.abs(d.total)
          const pct = Math.max((mag / max) * 100, 2)
          return (
            <div key={d.key} className="relative flex-1 h-full">
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 max-w-[44px] rounded-t-p-sm"
                style={{
                  height: `${pct}%`,
                  background: 'var(--lagoon)',
                  opacity: d.current ? 1 : 0.3,
                }}
              >
                <div
                  className="absolute -top-5 left-0 right-0 text-center font-bold text-[10px] leading-none tabular-nums whitespace-nowrap"
                  style={{
                    color: d.current
                      ? 'var(--lagoon-deep)'
                      : 'var(--sea-ink-soft)',
                  }}
                >
                  {formatVndShort(mag)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-2.5 mt-2">
        {data.map((d) => (
          <div
            key={d.key}
            className="flex-1 text-center text-[11px] leading-none"
            style={{
              fontWeight: d.current ? 700 : 500,
              color: d.current ? 'var(--sea-ink)' : 'var(--sea-ink-soft)',
            }}
          >
            {d.short}
          </div>
        ))}
      </div>
    </div>
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
      <div className="flex justify-center mb-1">
        <MODonut items={items} size={150} stroke={26} />
      </div>

      <div className="flex flex-col">
        {items.map((b) => (
          <div key={b.cat} className="flex items-center gap-2.5 py-2">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] leading-none shrink-0"
              style={{ background: b.dot }}
            >
              {b.emoji}
            </span>
            <span className="font-bold text-[13px] leading-none text-sea-ink">
              {b.name}
            </span>
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
export default function Dashboard({
  expenses,
  onAccount,
  userInitials,
}: DashboardProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const categories = useCategories()
  const frequencies = useFrequencies()
  const todayFreqIds = new Set(
    frequencies.filter((f) => f.displayOrder <= 1).map((f) => f.id),
  )
  const weekFreqIds = new Set(
    frequencies.filter((f) => f.displayOrder <= 2).map((f) => f.id),
  )

  const P = periodSummary(expenses, undefined, { todayFreqIds, weekFreqIds })
  const monthExp = expenses.filter((e) => e.date.slice(0, 7) === P.monthKey)
  const breakdown = catBreakdown(monthExp, categories)
  const series = monthSeries(expenses, P.monthKey, i18n.language)

  const prevKey = getPrevMonth(P.monthKey)
  const prevTotal = expenses
    .filter((e) => e.date.slice(0, 7) === prevKey)
    .reduce((s, e) => s + e.amount, 0)
  const monthDelta =
    prevTotal !== 0
      ? Math.round(
          ((Math.abs(P.month) - Math.abs(prevTotal)) / Math.abs(prevTotal)) *
            100,
        )
      : null

  const avgMo =
    P.yearMonths > 0
      ? -Math.round(Math.abs(P.year) / P.yearMonths / 1000) * 1000
      : 0

  const dow = (new Date().getDay() + 6) % 7
  const daysElapsed = dow + 1
  const avgDay =
    P.week !== 0 ? -Math.round(Math.abs(P.week) / daysElapsed / 1000) * 1000 : 0

  const monthShortName = monthShort(P.monthKey, i18n.language)
  const prevShort = monthShort(prevKey, i18n.language)

  function countLabel(n: number) {
    return `${n} ${n === 1 ? t('dashboard.expense') : t('dashboard.expenses')}`
  }

  return (
    <>
      <Header
        variant="mark"
        onAccount={onAccount}
        userInitials={userInitials}
      />
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
            <div className="flex items-center justify-between gap-1">
              <span className="font-medium text-[10px] leading-none text-lagoon-deep tabular-nums">
                {t('dashboard.avgPerDayValue', { value: formatVnd(avgDay) })}
              </span>
              <div className="text-[11px] leading-none">
                {P.weekDelta !== null ? (
                  <MODelta
                    delta={P.weekDelta}
                    vs={t('dashboard.vsLastWeekShort')}
                  />
                ) : (
                  <span className="font-medium text-sea-ink-soft">
                    {countLabel(P.weekCount)}
                  </span>
                )}
              </div>
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

        {/* ── Spending over months ───────────────────────────────────── */}
        <div className="px-4 pt-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-bold text-[15px] leading-none text-sea-ink">
              {t('dashboard.spendingOverMonths')}
            </span>
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: ROUTES.EXPENSES,
                  search: { filter: FILTER.ALL, sort: SORT.DATE },
                })
              }
              className="font-medium text-[12px] leading-none text-lagoon-deep bg-transparent border-0 cursor-pointer p-0"
            >
              {t('dashboard.seeAll')}
            </button>
          </div>
          <div className="bg-white rounded-p-md p-4 shadow-card">
            <MOMonthsChart data={series} />
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
                navigate({
                  to: ROUTES.EXPENSES,
                  search: { filter: FILTER.ALL, sort: SORT.DATE },
                })
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
