import { cn } from '#/lib/utils'
import { categoryColor } from '#/lib/categories'

interface CategoryChipProps {
  cat: { id: number; name: string; icon: string }
  selected: boolean
  onClick: () => void
}

export function CategoryChip({ cat, selected, onClick }: CategoryChipProps) {
  const { dot, ink } = categoryColor(cat.id)
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-9 px-2.5 rounded-p-md flex items-center justify-center',
        'font-bold text-[11px] leading-none cursor-pointer',
        'border-2 transition-transform duration-150 active:scale-[0.96]',
        selected ? 'border-sea-ink' : 'border-transparent',
      )}
      style={{ background: dot, color: ink }}
    >
      {cat.icon}&nbsp;{cat.name}
    </button>
  )
}

interface FilterChipProps {
  label: string
  emoji?: string
  active: boolean
  accent?: 'lagoon' | 'dark'
  onClick: () => void
}

export function FilterChip({
  label,
  emoji,
  active,
  accent = 'lagoon',
  onClick,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-none h-7 px-3.5 rounded-full inline-flex items-center gap-1.5',
        'font-bold text-[11px] leading-none cursor-pointer border',
        'transition-colors duration-150',
        active &&
          accent === 'lagoon' &&
          'bg-lagoon text-white border-transparent',
        active &&
          accent === 'dark' &&
          'bg-sea-ink text-white border-transparent',
        !active && 'bg-white text-sea-ink border-hairline hover:bg-foam',
      )}
    >
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
    </button>
  )
}
