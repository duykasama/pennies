import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { Expense } from '#/lib/pennies'
import {
  formatVnd,
  isoCurrentMonth,
  monthLabel,
  monthShort,
  expenseMonth,
  getAvailableMonths,
  calcMonthTotal,
  getPrevMonth,
} from '#/lib/pennies'
import { ROUTES, SORT, FILTER } from '#/lib/constants'
import MonthSelector from '#/components/pennies/desktop/MonthSelector'
import SummaryCards from '#/components/pennies/desktop/SummaryCards'
import RecentList from '#/components/pennies/desktop/RecentList'

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

  function openExpense(exp: Expense) {
    navigate({
      to: '/expenses/$expenseId',
      params: { expenseId: exp.id },
      search: { filter: FILTER.ALL, sort: SORT.DATE },
    })
  }

  return (
    <div>
      {/* Month hero */}
      <div className="bg-white px-12 pt-8 pb-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-bold text-[11px] leading-none text-sea-ink-soft uppercase tracking-[0.08em] mb-3">
              {t('dashboard.totalSpent')} · {monthLabel(month)}
            </p>
            <div className="flex items-baseline gap-4">
              <p className="font-display font-bold text-[44px] leading-none tracking-[-0.015em] text-sea-ink tabular-nums m-0">
                {formatVnd(total)}
              </p>
              {deltaPct !== null && (
                <span className={`font-bold text-[15px] leading-none ${deltaPct <= 0 ? 'text-success' : 'text-danger'}`}>
                  {deltaPct <= 0 ? '↓' : '↑'} {Math.abs(deltaPct)}% vs {monthShort(prev)}
                </span>
              )}
            </div>
          </div>
          <MonthSelector month={month} months={months} onChange={setMonth} />
        </div>
      </div>

      <SummaryCards expenses={expenses} month={month} />

      <div className="px-12 pt-2 pb-12">
        <div className="flex items-center justify-between mt-7 mb-3.5">
          <h3 className="m-0 font-bold text-[18px] leading-none text-sea-ink">
            {t('dashboard.monthExpenses', { month: monthLabel(month) })}
          </h3>
          {inMonth.length > 0 && (
            <button
              type="button"
              onClick={() => navigate({ to: ROUTES.EXPENSES, search: { filter: FILTER.ALL, sort: SORT.DATE } })}
              className="font-medium text-[13px] leading-none text-lagoon-deep bg-transparent border-0 cursor-pointer p-0 hover:text-sea-ink"
            >
              {t('dashboard.viewAll')}
            </button>
          )}
        </div>

        {inMonth.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-[96px] h-[96px] rounded-full bg-sand flex items-center justify-center font-display font-bold text-[40px] leading-none text-sea-ink-muted mx-auto">
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
          <RecentList expenses={inMonth} onOpenExpense={openExpense} />
        )}
      </div>
    </div>
  )
}
