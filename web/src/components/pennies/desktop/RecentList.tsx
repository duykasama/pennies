import type { Expense } from '#/lib/pennies'
import ExpenseRow from '#/components/pennies/ExpenseRow'

interface RecentListProps {
  expenses: Expense[]
  onOpenExpense?: (exp: Expense) => void
}

export default function RecentList({ expenses, onOpenExpense }: RecentListProps) {
  const recent = expenses.slice(0, 4)
  return (
    <div>
      {recent.map((exp) => (
        <ExpenseRow
          key={exp.id}
          expense={exp}
          variant="desktop"
          onClick={onOpenExpense ? () => onOpenExpense(exp) : undefined}
        />
      ))}
    </div>
  )
}
