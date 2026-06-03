import { useTranslation } from 'react-i18next'
import { CATEGORIES } from '#/lib/pennies'
import { SORT, FILTER } from '#/lib/constants'
import type { SortOption } from '#/lib/constants'
import { cn } from '#/lib/utils'

interface FilterToolbarProps {
  filter: string
  setFilter: (f: string) => void
  sort: SortOption
  setSort: (s: SortOption) => void
}

export default function FilterToolbar({ filter, setFilter, sort, setSort }: FilterToolbarProps) {
  const { t } = useTranslation()
  const displayCategories = CATEGORIES.slice(0, 6)

  return (
    <div className="bg-white px-12 py-3.5 flex items-center gap-2.5 border-b border-hairline">
      {/* All chip */}
      <button
        type="button"
        onClick={() => setFilter(FILTER.ALL)}
        className={cn(
          'h-8 px-3.5 rounded-full font-bold text-[12px] border cursor-pointer transition-colors',
          filter === FILTER.ALL
            ? 'bg-lagoon text-white border-transparent'
            : 'bg-white text-sea-ink border-hairline hover:bg-foam',
        )}
      >
        {t('expenses.filterAll')}
      </button>

      {/* Category chips */}
      {displayCategories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => setFilter(cat.id)}
          className={cn(
            'h-8 px-3.5 rounded-full font-bold text-[12px] border cursor-pointer transition-colors',
            filter === cat.id
              ? 'bg-lagoon text-white border-transparent'
              : 'bg-white text-sea-ink border-hairline hover:bg-foam',
          )}
        >
          {cat.emoji} {(t as (k: string) => string)(`categories.${cat.id}.label`)}
        </button>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Sort */}
      <div className="flex items-center gap-3.5 text-[13px] text-sea-ink-soft">
        <span>{t('expenses.sortBy')}</span>
        <button
          type="button"
          onClick={() => setSort(SORT.DATE)}
          className={cn(
            'bg-transparent border-0 cursor-pointer p-0 text-[13px]',
            sort === SORT.DATE ? 'font-bold text-sea-ink' : 'font-medium text-sea-ink-soft',
          )}
        >
          {t('expenses.sortDate')}
        </button>
        <span className="text-hairline">|</span>
        <button
          type="button"
          onClick={() => setSort(SORT.AMOUNT)}
          className={cn(
            'bg-transparent border-0 cursor-pointer p-0 text-[13px]',
            sort === SORT.AMOUNT ? 'font-bold text-sea-ink' : 'font-medium text-sea-ink-soft',
          )}
        >
          {t('expenses.sortAmount')}
        </button>
      </div>
    </div>
  )
}
