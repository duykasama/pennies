import { formatVnd } from '#/lib/pennies'

interface SummaryCardProps {
  label: string
  amount: number
  sub?: string
}

export default function SummaryCard({ label, amount, sub }: SummaryCardProps) {
  return (
    <div className="flex-1 bg-white rounded-p-md p-3.5 shadow-card flex flex-col gap-1.5">
      <p className="font-medium text-[11px] leading-none text-sea-ink-soft">
        {label}
      </p>
      <p className="font-bold text-[18px] leading-none text-sea-ink tabular-nums">
        {formatVnd(amount)}
      </p>
      {sub && (
        <p className="font-medium text-[11px] leading-none text-lagoon-deep">
          {sub}
        </p>
      )}
    </div>
  )
}
