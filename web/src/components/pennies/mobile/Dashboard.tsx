import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { Expense } from '#/lib/pennies'
import {
  CAT_BY_ID,
  formatVnd,
  isoCurrentMonth,
  monthShort,
  daysElapsed,
  expenseMonth,
  getAvailableMonths,
  calcMonthTotal,
  calcTopCategory,
  getPrevMonth,
} from '#/lib/pennies'
import { ROUTES, SORT, FILTER } from '#/lib/constants'
import Header from '#/components/pennies/mobile/Header'
import SummaryCard from '#/components/pennies/mobile/SummaryCard'
import MonthSelector from '#/components/pennies/mobile/MonthSelector'
import ExpenseRow from '#/components/pennies/ExpenseRow'

interface DashboardProps {
  expenses: Expense[]
}

export default function Dashboard({ expenses }: DashboardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const months = getAvailableMonths(expenses)
  const [month, setMonth] = useState(isoCurrentMonth())

  const inMonth = expenses.filter((e) => expenseMonth(e) === month)
  const total = inMonth.reduce((s, e) => s + e.amount, 0)

  const prev = getPrevMonth(month)
  const prevTotal = calcMonthTotal(expenses, prev)
  const deltaPct =
    prevTotal !== 0
      ? Math.round((Math.abs(total) - Math.abs(prevTotal)) / Math.abs(prevTotal) * 100)
      : null

  const days = daysElapsed(month)
  const dailyAvg = inMonth.length ? -Math.round(Math.abs(total) / days / 1000) * 1000 : 0

  const top = calcTopCategory(expenses, month)
  const topCat = top ? CAT_BY_ID[top.cat] : null

  const recent = inMonth.slice(0, 5)

  function openExpense(exp: Expense) {
    navigate({
      to: '/expenses/$expenseId',
      params: { expenseId: exp.id },
      search: { filter: FILTER.ALL, sort: SORT.DATE },
    })
  }

  return (
    <>
      <Header variant="mark" />
      <div className="absolute inset-x-0 top-14 bottom-14 overflow-y-auto">
        {/* Month hero */}
        <div className="bg-white px-4 pt-4 pb-5">
          <MonthSelector month={month} months={months} onChange={setMonth} />
          <div className="mt-4 text-center">
            <p className="font-bold text-[11px] leading-none text-sea-ink-soft uppercase tracking-[0.08em]">
              {t('dashboard.totalSpent')}
            </p>
            <p className="mt-2 font-bold text-[34px] leading-none text-sea-ink tabular-nums">
              {formatVnd(total)}
            </p>
            <div className="mt-2.5 flex items-center justify-center gap-2 font-medium text-[12px] leading-none">
              <span className="text-sea-ink-soft">
                {inMonth.length} {t('dashboard.expenses')}
              </span>
              {deltaPct !== null && (
                <>
                  <span className="text-sea-ink-muted">·</span>
                  <span className={deltaPct <= 0 ? 'text-success font-bold' : 'text-danger font-bold'}>
                    {deltaPct <= 0 ? '↓' : '↑'} {Math.abs(deltaPct)}% vs {monthShort(prev)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="flex gap-3 p-4">
          <SummaryCard
            label={t('dashboard.dailyAverage')}
            amount={dailyAvg}
            sub={t('dashboard.overDays', { count: days })}
          />
          <div className="flex-1 bg-white rounded-p-md p-3.5 shadow-card flex flex-col gap-1.5">
            <p className="font-medium text-[11px] leading-none text-sea-ink-soft">
              {t('dashboard.topCategory')}
            </p>
            {topCat ? (
              <>
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[13px] leading-none"
                    style={{ background: topCat.dot }}
                  >
                    {topCat.emoji}
                  </span>
                  <span className="font-bold text-[15px] leading-none text-sea-ink">{topCat.label}</span>
                </div>
                <p className="font-medium text-[11px] leading-none text-lagoon-deep tabular-nums">
                  {formatVnd(top!.amount)}
                </p>
              </>
            ) : (
              <p className="font-bold text-[15px] leading-none text-sea-ink-muted">—</p>
            )}
          </div>
        </div>

        {/* Month's expenses */}
        <div className="flex items-center justify-between px-4 pt-2 pb-1.5">
          <span className="font-bold text-[15px] leading-none text-sea-ink">
            {t('dashboard.monthExpenses', { month: monthShort(month) })}
          </span>
          {inMonth.length > 0 && (
            <button
              type="button"
              onClick={() => navigate({ to: ROUTES.EXPENSES, search: { filter: FILTER.ALL, sort: SORT.DATE } })}
              className="font-medium text-[12px] leading-none text-lagoon-deep bg-transparent border-0 cursor-pointer p-0"
            >
              {t('dashboard.viewAll')}
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center pt-10 pb-12 px-8 text-center">
            <div className="w-[96px] h-[96px] rounded-full bg-sand flex items-center justify-center font-display font-bold text-[40px] leading-none text-sea-ink-muted">
              ₫
            </div>
            <p className="mt-5 mb-1.5 font-bold text-[16px] leading-none text-sea-ink">
              {t('dashboard.nothingInMonth', { month: monthShort(month) })}
            </p>
            <p className="m-0 font-medium text-[13px] leading-none text-sea-ink-soft">
              {t('dashboard.noExpensesThisMonth')}
            </p>
          </div>
        ) : (
          <div className="pb-4">
            {recent.map((exp) => (
              <ExpenseRow key={exp.id} expense={exp} variant="mobile" onClick={() => openExpense(exp)} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
