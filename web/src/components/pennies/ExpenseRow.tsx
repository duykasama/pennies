import { useTranslation } from 'react-i18next'
import { CAT_BY_ID, formatVnd } from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'
import { cn } from '#/lib/utils'

interface ExpenseRowProps {
  expense: Expense
  variant?: 'mobile' | 'desktop'
}

export default function ExpenseRow({ expense, variant = 'mobile' }: ExpenseRowProps) {
  const { t } = useTranslation()
  const cat = CAT_BY_ID[expense.cat]
  const isDesktop = variant === 'desktop'

  const dateLabels: Record<string, string> = {
    today: t('dates.today'),
    yesterday: t('dates.yesterday'),
  }
  const dateLabel = dateLabels[expense.date] ?? expense.date

  return (
    <div
      className={cn(
        'mx-4 mb-2 px-3.5 py-3.5 bg-white rounded-p-md shadow-card hover:bg-foam transition-colors duration-150 cursor-pointer',
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
        style={{ background: cat.dot }}
      >
        {cat.emoji}
      </div>

      {/* Title + sub */}
      <div className="min-w-0">
        <p className="font-bold text-[14px] leading-none text-sea-ink truncate">
          {t(`categories.${expense.cat}.long`)}
        </p>
        <p className="mt-1 font-medium text-[12px] leading-none text-sea-ink-soft truncate">{expense.sub}</p>
      </div>

      {/* Date column (desktop only) */}
      {isDesktop && (
        <p className="font-medium text-[13px] leading-none text-sea-ink-soft">{dateLabel}</p>
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
