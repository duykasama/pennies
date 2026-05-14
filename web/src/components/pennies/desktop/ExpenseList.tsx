import { useTranslation } from 'react-i18next'
import { DATE_ORDER } from '#/lib/pennies'
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
}

export default function ExpenseList({
  expenses,
  filter,
  setFilter,
  sort,
  setSort,
}: ExpenseListProps) {
  const { t } = useTranslation()

  const filtered = filter === FILTER.ALL ? expenses : expenses.filter((e) => e.cat === filter)

  const sorted =
    sort === SORT.AMOUNT
      ? [...filtered].sort((a, b) => a.amount - b.amount)
      : [...filtered].sort(
          (a, b) => DATE_ORDER.indexOf(a.date) - DATE_ORDER.indexOf(b.date),
        )

  const dateLabels: Record<string, string> = {
    today: t('dates.today'),
    yesterday: t('dates.yesterday'),
  }

  // Group by date when sorting by date
  const groups: { date: string; items: Expense[] }[] = []
  if (sort === SORT.DATE) {
    for (const date of DATE_ORDER) {
      const items = sorted.filter((e) => e.date === date)
      if (items.length > 0) groups.push({ date, items })
    }
    const remaining = sorted.filter((e) => !DATE_ORDER.includes(e.date))
    if (remaining.length > 0) groups.push({ date: 'Other', items: remaining })
  }

  return (
    <div>
      <FilterToolbar filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />
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
                  — {dateLabels[group.date] ?? group.date}
                </p>
                {group.items.map((exp) => (
                  <ExpenseRow key={exp.id} expense={exp} variant="desktop" />
                ))}
              </div>
            ))
          : sorted.map((exp) => <ExpenseRow key={exp.id} expense={exp} variant="desktop" />)}
      </div>
    </div>
  )
}
