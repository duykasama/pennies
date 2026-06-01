import { useState } from 'react'
import { monthLabel } from '#/lib/pennies'
import { cn } from '#/lib/utils'

interface MonthSelectorProps {
  month: string
  months: string[]
  onChange: (m: string) => void
}

export default function MonthSelector({ month, months, onChange }: MonthSelectorProps) {
  const [open, setOpen] = useState(false)
  const idx = months.indexOf(month)

  const chevron = (enabled: boolean) =>
    cn(
      'w-9 h-9 rounded-full flex items-center justify-center text-[18px] leading-none border-0 transition-colors duration-150',
      enabled
        ? 'bg-foam text-sea-ink hover:bg-sand cursor-pointer'
        : 'bg-transparent text-sea-ink-muted cursor-default',
    )

  return (
    <div className="relative flex items-center justify-center gap-2">
      <button
        type="button"
        className={chevron(idx > 0)}
        disabled={idx <= 0}
        onClick={() => onChange(months[idx - 1])}
        aria-label="Previous month"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-9 px-4 rounded-full bg-foam hover:bg-sand text-sea-ink font-bold text-[15px] leading-none cursor-pointer inline-flex items-center gap-1.5 transition-colors duration-150 border-0"
      >
        <span>{monthLabel(month)}</span>
        <span className={cn('text-[10px] text-sea-ink-soft transition-transform duration-150', open && 'rotate-180')}>▾</span>
      </button>

      <button
        type="button"
        className={chevron(idx < months.length - 1)}
        disabled={idx >= months.length - 1}
        onClick={() => onChange(months[idx + 1])}
        aria-label="Next month"
      >
        ›
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-20 w-[180px] bg-white rounded-p-md shadow-pop p-1.5">
            {[...months].reverse().map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { onChange(m); setOpen(false) }}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-p-sm text-[14px] leading-none cursor-pointer border-0 bg-transparent flex items-center justify-between transition-colors duration-150',
                  m === month ? 'text-sea-ink font-bold' : 'text-sea-ink-soft font-medium hover:bg-foam',
                )}
              >
                <span>{monthLabel(m)}</span>
                {m === month && <span className="text-lagoon-deep">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
