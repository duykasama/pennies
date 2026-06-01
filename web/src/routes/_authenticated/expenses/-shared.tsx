import type { Expense } from '#/lib/pennies'
import type { SortOption } from '#/lib/constants'
import { getExpensesFn } from '#/lib/expenses'
import BottomNav from '#/components/pennies/mobile/BottomNav'
import MobileExpenseList from '#/components/pennies/mobile/ExpenseList'
import MobileEditExpense from '#/components/pennies/mobile/EditExpense'
import TopNav from '#/components/pennies/desktop/TopNav'
import DesktopExpenseList from '#/components/pennies/desktop/ExpenseList'
import DesktopEditExpense from '#/components/pennies/desktop/EditExpense'

export const expensesQuery = { queryKey: ['expenses'], queryFn: () => getExpensesFn() }

interface ExpensesPageLayoutProps {
  expenses: Expense[]
  filter: string
  setFilter: (f: string) => void
  sort: SortOption
  setSort: (s: SortOption) => void
  onOpenExpense: (exp: Expense) => void
  editingExpense: Expense | null
  onCloseEdit: () => void
  onUpdate: (exp: Expense) => Promise<void>
  onDelete: (id: string) => Promise<void>
  toastMsg: string | null
}

export function ExpensesPageLayout({
  expenses,
  filter,
  setFilter,
  sort,
  setSort,
  onOpenExpense,
  editingExpense,
  onCloseEdit,
  onUpdate,
  onDelete,
  toastMsg,
}: ExpensesPageLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-base">
      {/* Mobile */}
      <div className="md:hidden relative w-full min-h-screen overflow-hidden bg-bg-base font-sans text-sea-ink">
        <BottomNav />
        <MobileExpenseList
          expenses={expenses}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
          onOpenExpense={onOpenExpense}
        />
        {editingExpense && (
          <MobileEditExpense
            expense={editingExpense}
            onClose={onCloseEdit}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}
        {toastMsg && (
          <div className="fixed left-4 right-4 bottom-[84px] bg-sea-ink text-white px-[18px] py-3.5 rounded-p-md shadow-pop font-sans font-medium text-[13px] leading-tight flex items-center gap-2.5 toast-in z-50">
            <span className="text-lagoon-mist font-bold">✓</span>
            <span>{toastMsg}</span>
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block w-full min-h-screen bg-bg-base font-sans text-sea-ink">
        <TopNav />
        <DesktopExpenseList
          expenses={expenses}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
          onOpenExpense={onOpenExpense}
        />
        {editingExpense && (
          <DesktopEditExpense
            expense={editingExpense}
            onClose={onCloseEdit}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}
        {toastMsg && (
          <div className="fixed right-8 bottom-8 bg-sea-ink text-white px-5 py-3.5 rounded-p-md shadow-pop font-sans font-medium text-[13px] leading-tight flex items-center gap-2.5 toast-in z-50">
            <span className="text-lagoon-mist font-bold">✓</span>
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </div>
  )
}
