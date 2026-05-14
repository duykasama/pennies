import type { Expense } from '#/lib/pennies'
import ExpenseRow from '#/components/pennies/ExpenseRow'

interface RecentListProps {
  expenses: Expense[]
}

export default function RecentList({ expenses }: RecentListProps) {
  const recent = expenses.slice(0, 4)
  return (
    <div>
      {recent.map((exp) => (
        <ExpenseRow key={exp.id} expense={exp} variant="desktop" />
      ))}
    </div>
  )
}
