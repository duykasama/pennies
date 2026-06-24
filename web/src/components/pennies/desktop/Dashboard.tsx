import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { Expense, CatBreakdownItem, MonthSeriesItem } from '#/lib/pennies'
import {
  formatVnd,
  formatVndShort,
  monthShort,
  monthLabel,
  periodSummary,
  catBreakdown,
  monthSeries,
  getPrevMonth,
} from '#/lib/pennies'
import { useCategories } from '#/hooks/useCategories'
import { ROUTES, SORT, FILTER } from '#/lib/constants'

interface DashboardProps {
  expenses: Expense[]
}

// ── Trend chip ───────────────────────────────────────────────────────────────
function TrendChip({ delta, vs }: { delta: number | null; vs: string }) {
  if (delta === null) return null
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
      <span>
        {down ? '↓' : '↑'} {Math.abs(delta)}%
      </span>
      <span className="opacity-70 font-medium">vs {vs}</span>
    </span>
  )
}

// ── Donut chart ──────────────────────────────────────────────────────────────
function Donut({
  items,
  size = 200,
  stroke = 34,
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
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ flexShrink: 0 }}
    >
      {segs}
      {ticks}
      <text
        x={c}
        y={c}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          font: '700 22px var(--font-body)',
          fill: 'var(--sea-ink)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatVnd(total)}
      </text>
    </svg>
  )
}

// ── Months bar chart ──────────────────────────────────────────────────────────
function MonthsChart({
  data,
  plot = 150,
}: {
  data: MonthSeriesItem[]
  plot?: number
}) {
  const max = Math.max(...data.map((d) => Math.abs(d.total)), 1)
  return (
    <div>
      <div className="flex items-end gap-5 pt-6" style={{ height: plot }}>
        {data.map((d) => {
          const mag = Math.abs(d.total)
          const pct = Math.max((mag / max) * 100, 2)
          return (
            <div key={d.key} className="relative flex-1 h-full">
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 max-w-[72px] rounded-t-p-sm"
                style={{
                  height: `${pct}%`,
                  background: 'var(--lagoon)',
                  opacity: d.current ? 1 : 0.3,
                }}
              >
                <div
                  className="absolute -top-6 left-0 right-0 text-center font-bold text-[12px] leading-none tabular-nums whitespace-nowrap"
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
      <div className="flex gap-5 mt-2.5">
        {data.map((d) => (
          <div
            key={d.key}
            className="flex-1 text-center text-[13px] leading-none"
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
      <p className="font-medium text-[13px] leading-none text-sea-ink-soft m-0">
        {label}
      </p>
      <p className="mt-3 font-bold text-[30px] leading-none text-sea-ink tabular-nums m-0">
        {value}
      </p>
      <div className="mt-auto pt-4">{children}</div>
    </div>
  )
}

// ── Category breakdown donut + legend ────────────────────────────────────────
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
    <div className="flex items-center gap-9">
      <Donut items={items} size={200} stroke={34} />
      <div className="flex-1 grid grid-cols-2 gap-x-10 gap-y-4">
        {items.map((b) => (
          <div key={b.cat} className="flex items-center gap-3">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-[14px] leading-none shrink-0"
              style={{ background: b.dot }}
            >
              {b.emoji}
            </span>
            <span className="font-bold text-[14px] leading-none text-sea-ink">
              {b.name}
            </span>
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
    </div>
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

  const monthName = monthLabel(P.monthKey, i18n.language)
  const monthShortName = monthShort(P.monthKey, i18n.language)
  const prevShort = monthShort(prevKey, i18n.language)

  const niceDate = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
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
              {P.monthCount}{' '}
              {P.monthCount === 1
                ? t('dashboard.expense')
                : t('dashboard.expenses')}{' '}
              {t('dashboard.soFarThisMonth')}
            </p>
          </div>

          <div className="text-right pt-1">
            <p className="font-bold text-[12px] leading-none text-lagoon-deep uppercase tracking-[0.06em] m-0">
              {t('dashboard.today')}
            </p>
            <p className="mt-2.5 font-bold text-[16px] leading-none text-sea-ink m-0">
              {niceDate}
            </p>
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
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-[13px] leading-none text-lagoon-deep tabular-nums">
              {t('dashboard.avgPerDayValue', { value: formatVnd(avgDay) })}
            </span>
            {P.weekDelta !== null ? (
              <TrendChip
                delta={P.weekDelta}
                vs={t('dashboard.vsLastWeekShort')}
              />
            ) : (
              <span className="font-medium text-[13px] leading-none text-sea-ink-soft">
                {countLabel(P.weekCount)}
              </span>
            )}
          </div>
        </PeriodTile>

        <PeriodTile label={t('dashboard.thisYear')} value={formatVnd(P.year)}>
          <span className="font-medium text-[13px] leading-none text-lagoon-deep tabular-nums">
            {t('dashboard.avgPerMonthValue', { value: formatVnd(avgMo) })}
          </span>
        </PeriodTile>
      </div>

      {/* ── Spending over months ────────────────────────────────────── */}
      <div className="px-12 pt-9">
        <div className="flex items-center justify-between mb-4">
          <h3 className="m-0 font-bold text-[18px] leading-none text-sea-ink">
            {t('dashboard.spendingOverMonths')}
          </h3>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: ROUTES.EXPENSES,
                search: { filter: FILTER.ALL, sort: SORT.DATE },
              })
            }
            className="font-medium text-[13px] leading-none text-lagoon-deep hover:text-sea-ink bg-transparent border-0 cursor-pointer p-0"
          >
            {t('dashboard.seeAll')}
          </button>
        </div>
        <div className="bg-white rounded-p-md p-6 shadow-card">
          <MonthsChart data={series} />
        </div>
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
              navigate({
                to: ROUTES.EXPENSES,
                search: { filter: FILTER.ALL, sort: SORT.DATE },
              })
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
