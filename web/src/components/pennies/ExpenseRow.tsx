import { useTranslation } from 'react-i18next'
import { formatVnd } from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'
import { categoryColor } from '#/lib/categories'
import { useCategories } from '#/hooks/useCategories'
import { cn } from '#/lib/utils'

interface ExpenseRowProps {
  expense: Expense
  variant?: 'mobile' | 'desktop'
  onClick?: () => void
}

export default function ExpenseRow({
  expense,
  variant = 'mobile',
  onClick,
}: ExpenseRowProps) {
  const { t, i18n } = useTranslation()
  const categories = useCategories()
  const cat = categories.find((c) => c.id === expense.cat)
  const dot = categoryColor(expense.cat).dot
  const isDesktop = variant === 'desktop'

  const dateLabels: Record<string, string> = {
    today: t('dates.today'),
    yesterday: t('dates.yesterday'),
  }
  const dateLabel =
    dateLabels[expense.date] ??
    new Date(expense.date + 'T00:00:00').toLocaleDateString(i18n.language, {
      month: 'short',
      day: 'numeric',
    })

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      className={cn(
        'mx-4 mb-2 px-3.5 py-3.5 bg-white rounded-p-md shadow-card transition-colors duration-150',
        onClick && 'hover:bg-foam cursor-pointer',
        isDesktop
          ? 'grid grid-cols-[32px_1fr_220px_140px] gap-4 items-center'
          : 'grid grid-cols-[28px_1fr_auto] gap-3 items-center',
      )}
    >
      {/* Category dot */}
      <div
        className={cn(
          'rounded-full flex items-center justify-center select-none flex-shrink-0',
          isDesktop ? 'w-8 h-8 text-[16px]' : 'w-7 h-7 text-[14px]',
        )}
        style={{ background: dot }}
      >
        {cat?.icon ?? '·'}
      </div>

      {/* Title + sub */}
      <div className="min-w-0">
        <p className="font-bold text-[14px] leading-none text-sea-ink truncate">
          {expense.title}
        </p>
        <p className="mt-1 font-medium text-[12px] leading-none text-sea-ink-soft truncate">
          {expense.sub}
        </p>
      </div>

      {/* Date column (desktop only) */}
      {isDesktop && (
        <p className="font-medium text-[13px] leading-none text-sea-ink-soft">
          {dateLabel}
        </p>
      )}

      {/* Amount */}
      <p
        className={cn(
          'font-bold tabular-nums text-sea-ink',
          isDesktop ? 'text-[16px] text-right' : 'text-[14px]',
        )}
      >
        {formatVnd(expense.amount)}
      </p>
    </div>
  )
}
