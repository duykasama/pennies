import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Expense } from '#/lib/pennies'
import { categoryColor } from '#/lib/categories'
import { useCategories } from '#/hooks/useCategories'
import { cn } from '#/lib/utils'

interface EditExpenseProps {
  expense: Expense
  onClose: () => void
  onUpdate: (exp: Expense) => void
  onDelete: (id: string) => void
}

export default function EditExpense({ expense, onClose, onUpdate, onDelete }: EditExpenseProps) {
  const { t } = useTranslation()
  const categories = useCategories()
  const [amountStr, setAmountStr] = useState(() => String(Math.abs(expense.amount)))
  const [desc, setDesc] = useState(expense.title)
  const [cat, setCat] = useState(expense.cat)
  const [date, setDate] = useState(expense.date)
  const [note, setNote] = useState(expense.sub)
  const [errors, setErrors] = useState<{ amount?: string; desc?: string }>({})

  function handleUpdate() {
    const n = parseFloat(amountStr.replace(/,/g, ''))
    const newErrors: { amount?: string; desc?: string } = {}
    if (!amountStr || isNaN(n) || n <= 0) newErrors.amount = t('editExpense.amountError')
    if (!desc.trim()) newErrors.desc = t('editExpense.descriptionError')
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    onUpdate({ ...expense, cat, title: desc.trim(), sub: note.trim(), amount: -n, date })
  }

  const inputBase =
    'w-full h-11 px-3.5 rounded-p-sm bg-white border border-hairline font-normal text-[14px] text-sea-ink outline-none transition-colors focus:border-lagoon focus:shadow-ring box-border'
  const inputError = 'bg-[#fff6f6] border-danger text-danger'
  const labelBase = 'block font-bold text-[13px] leading-none text-sea-ink mb-2'

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-sea-ink/30 backdrop-blur-[4px] modal-fade" onClick={onClose} />

      <div className="relative w-[520px] max-h-full overflow-y-auto bg-foam rounded-p-lg shadow-pop p-8 modal-pop">
        <div className="flex items-center justify-between mb-5">
          <h1 className="m-0 font-bold text-[24px] leading-none text-sea-ink">{t('editExpense.title')}</h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-white hover:bg-sand text-sea-ink-soft border-0 cursor-pointer flex items-center justify-center text-[16px] leading-none shadow-card transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className={labelBase}>{t('addExpense.amount')}</label>
          <input
            type="number"
            inputMode="decimal"
            value={amountStr}
            onChange={(e) => { setAmountStr(e.target.value); setErrors((p) => ({ ...p, amount: undefined })) }}
            className={cn(inputBase, errors.amount && inputError)}
            placeholder="0"
          />
          {errors.amount && <span className="block mt-1.5 font-medium text-[11px] text-danger">{errors.amount}</span>}
        </div>

        <div className="mb-4">
          <label className={labelBase}>{t('addExpense.description')}</label>
          <input
            type="text"
            value={desc}
            onChange={(e) => { setDesc(e.target.value); setErrors((p) => ({ ...p, desc: undefined })) }}
            className={cn(inputBase, errors.desc && inputError)}
            placeholder={t('addExpense.descriptionPlaceholder')}
          />
          {errors.desc && <span className="block mt-1.5 font-medium text-[11px] text-danger">{errors.desc}</span>}
        </div>

        <div className="mb-4">
          <label className={labelBase}>{t('addExpense.category')}</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const { dot, ink } = categoryColor(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  className={cn(
                    'h-8 px-3.5 rounded-full font-bold text-[12px] border-2 cursor-pointer inline-flex items-center gap-1.5 active:scale-[0.97] transition-transform',
                    cat === c.id ? 'border-sea-ink' : 'border-transparent',
                  )}
                  style={{ background: dot, color: ink }}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mb-4">
          <label className={labelBase}>{t('addExpense.date')}</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputBase} />
        </div>

        <div className="mb-6">
          <label className={labelBase}>{t('addExpense.note')}</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('addExpense.notePlaceholder')}
            className={inputBase}
          />
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onDelete(expense.id)}
            className="h-10 px-[22px] bg-danger-soft hover:brightness-95 text-danger border-0 rounded-p-sm font-bold text-[13px] leading-none cursor-pointer transition-all"
          >
            {t('editExpense.delete')}
          </button>
          <span className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-[22px] bg-white text-sea-ink hover:bg-foam border-0 rounded-p-sm font-bold text-[13px] leading-none cursor-pointer shadow-card transition-colors"
          >
            {t('editExpense.cancel')}
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="h-10 px-[22px] bg-lagoon hover:bg-lagoon-deep text-white border-0 rounded-p-sm font-bold text-[13px] leading-none cursor-pointer transition-colors"
          >
            {t('editExpense.update')}
          </button>
        </div>
      </div>
    </div>
  )
}
