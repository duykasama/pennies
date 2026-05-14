import { useTranslation } from 'react-i18next'
import { CATEGORIES, DATE_ORDER } from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'
import { SORT, FILTER } from '#/lib/constants'
import type { SortOption } from '#/lib/constants'
import Header from '#/components/pennies/mobile/Header'
import ExpenseRow from '#/components/pennies/ExpenseRow'
import { FilterChip } from '#/components/pennies/Chips'
import { cn } from '#/lib/utils'

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

  // Group by date
  const groups: { date: string; items: Expense[] }[] = []
  if (sort === SORT.DATE) {
    for (const date of DATE_ORDER) {
      const items = sorted.filter((e) => e.date === date)
      if (items.length > 0) groups.push({ date, items })
    }
    const remaining = sorted.filter((e) => !DATE_ORDER.includes(e.date))
    if (remaining.length > 0) groups.push({ date: 'Other', items: remaining })
  } else {
    groups.push({ date: '', items: sorted })
  }

  const displayCategories = CATEGORIES.slice(0, 4)

  return (
    <>
      <Header variant="title" title={t('expenses.title')} />
      <div className="absolute inset-x-0 top-14 bottom-14 overflow-y-auto">
        {/* Filter bar */}
        <div className="bg-white px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          <FilterChip
            label={t('expenses.filterAll')}
            active={filter === FILTER.ALL}
            accent="lagoon"
            onClick={() => setFilter(FILTER.ALL)}
          />
          {displayCategories.map((cat) => (
            <FilterChip
              key={cat.id}
              label={t(`categories.${cat.id}.label`)}
              emoji={cat.emoji}
              active={filter === cat.id}
              accent="lagoon"
              onClick={() => setFilter(cat.id)}
            />
          ))}
        </div>

        {/* Sort bar */}
        <div className="bg-foam px-4 py-2 flex gap-3 items-center">
          <span className="font-medium text-[12px] text-sea-ink-soft">{t('expenses.sortBy')}</span>
          <button
            type="button"
            onClick={() => setSort(SORT.DATE)}
            className={cn(
              'bg-transparent border-0 cursor-pointer p-0 text-[12px] font-medium',
              sort === SORT.DATE ? 'font-bold text-sea-ink' : 'text-sea-ink-soft',
            )}
          >
            {t('expenses.sortDate')}
          </button>
          <button
            type="button"
            onClick={() => setSort(SORT.AMOUNT)}
            className={cn(
              'bg-transparent border-0 cursor-pointer p-0 text-[12px] font-medium',
              sort === SORT.AMOUNT ? 'font-bold text-sea-ink' : 'text-sea-ink-soft',
            )}
          >
            {t('expenses.sortAmount')}
          </button>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center pt-24 px-8 text-center">
            <div className="w-[150px] h-[150px] rounded-full bg-sand flex items-center justify-center font-display font-bold text-[56px] text-sea-ink-muted">
              ₫
            </div>
            <p className="mt-7 mb-2 font-bold text-[18px] text-sea-ink">{t('expenses.emptyTitle')}</p>
            <p className="m-0 mb-5 font-medium text-[14px] text-sea-ink-soft">
              {t('expenses.emptyMessage')}
            </p>
          </div>
        )}

        {/* Expense groups */}
        {sort === SORT.DATE
          ? groups.map((group) => (
              <div key={group.date}>
                <p className="px-4 pt-1.5 pb-1 font-bold text-[11px] text-sea-ink-soft uppercase tracking-wide">
                  — {dateLabels[group.date] ?? group.date}
                </p>
                {group.items.map((exp) => (
                  <ExpenseRow key={exp.id} expense={exp} variant="mobile" />
                ))}
              </div>
            ))
          : sorted.map((exp) => <ExpenseRow key={exp.id} expense={exp} variant="mobile" />)}
      </div>
    </>
  )
}
