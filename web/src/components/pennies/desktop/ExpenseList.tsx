import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { Expense } from '#/lib/pennies'
import { SORT, FILTER } from '#/lib/constants'
import type { SortOption } from '#/lib/constants'
import FilterToolbar from '#/components/pennies/desktop/FilterToolbar'
import ExpenseRow from '#/components/pennies/ExpenseRow'

interface ExpenseListProps {
  expenses: Expense[]
  filter: string
  setFilter: (f: string) => void
  sort: SortOption
  setSort: (s: SortOption) => void
  onOpenExpense?: (exp: Expense) => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
}

export default function ExpenseList({
  expenses,
  filter,
  setFilter,
  sort,
  setSort,
  onOpenExpense,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: ExpenseListProps) {
  const { t, i18n } = useTranslation()
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!onLoadMore || !hasMore) return
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore()
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onLoadMore, hasMore])

  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  function dateLabel(d: string) {
    if (d === today) return t('dates.today')
    if (d === yesterday) return t('dates.yesterday')
    return new Date(d + 'T00:00:00').toLocaleDateString(i18n.language, {
      month: 'short',
      day: 'numeric',
    })
  }

  const filtered =
    filter === FILTER.ALL
      ? expenses
      : expenses.filter((e) => String(e.cat) === filter)

  const sorted =
    sort === SORT.AMOUNT
      ? [...filtered].sort((a, b) => a.amount - b.amount)
      : [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  const groups: { date: string; items: Expense[] }[] = []
  if (sort === SORT.DATE) {
    const uniqueDates = [...new Set(sorted.map((e) => e.date))].sort((a, b) =>
      b.localeCompare(a),
    )
    for (const date of uniqueDates) {
      groups.push({ date, items: sorted.filter((e) => e.date === date) })
    }
  }

  return (
    <div>
      <FilterToolbar
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />
      <div className="px-12 pt-4 pb-12">
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sea-ink-soft font-medium text-[14px]">
            {t('expenses.noExpensesInFilter')}
          </p>
        )}

        {sort === SORT.DATE
          ? groups.map((group) => (
              <div key={group.date}>
                <p className="px-4 pt-2 pb-1 font-bold text-[11px] text-sea-ink-soft uppercase tracking-wide">
                  — {dateLabel(group.date)}
                </p>
                {group.items.map((exp) => (
                  <ExpenseRow
                    key={exp.id}
                    expense={exp}
                    variant="desktop"
                    onClick={
                      onOpenExpense ? () => onOpenExpense(exp) : undefined
                    }
                  />
                ))}
              </div>
            ))
          : sorted.map((exp) => (
              <ExpenseRow
                key={exp.id}
                expense={exp}
                variant="desktop"
                onClick={onOpenExpense ? () => onOpenExpense(exp) : undefined}
              />
            ))}

        <div ref={sentinelRef} className="h-1" />
        {isLoadingMore && (
          <p className="py-6 text-center font-medium text-[13px] text-sea-ink-soft">
            {t('expenses.loadingMore')}
          </p>
        )}
      </div>
    </div>
  )
}
