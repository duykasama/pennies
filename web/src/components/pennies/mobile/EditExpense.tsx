import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Expense } from '#/lib/pennies'
import { useCategories } from '#/hooks/useCategories'
import { CategoryChip } from '#/components/pennies/Chips'
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
    'w-full h-11 px-3.5 rounded-p-md bg-foam border border-transparent font-normal text-[14px] text-sea-ink outline-none transition-colors focus:bg-white focus:border-lagoon box-border'
  const inputError = 'bg-danger-soft border-danger text-danger'
  const labelBase = 'block font-bold text-[12px] leading-none text-sea-ink-soft mb-2'

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center">
      <div className="absolute inset-0 bg-sea-ink/30 backdrop-blur-[3px] modal-fade" onClick={onClose} />

      <div className="relative w-full max-h-[88%] overflow-y-auto bg-white rounded-t-[24px] shadow-pop p-5 pb-7 modal-rise">
        <div className="w-9 h-1 rounded-full bg-sea-ink-muted/50 mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <p className="font-bold text-[22px] leading-none text-sea-ink">{t('editExpense.title')}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-foam hover:bg-sand text-sea-ink-soft border-0 cursor-pointer flex items-center justify-center text-[16px] leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleUpdate() }}>
          <div className="mb-4">
            <label className={labelBase}>{t('addExpense.amount')}</label>
            <input
              type="number"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => { setAmountStr(e.target.value); setErrors((p) => ({ ...p, amount: undefined })) }}
              className={cn(inputBase, 'h-[52px] font-bold text-[22px]', errors.amount && inputError)}
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
            <div className="grid grid-cols-4 gap-2">
              {categories.map((c) => (
                <CategoryChip key={c.id} cat={c} selected={cat === c.id} onClick={() => setCat(c.id)} />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className={labelBase}>{t('addExpense.date')}</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputBase} />
          </div>

          <div className="mb-5">
            <label className={labelBase}>{t('addExpense.note')}</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('addExpense.notePlaceholder')}
              className={inputBase}
            />
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 bg-foam hover:bg-sand text-sea-ink border-0 rounded-p-md font-bold text-[14px] leading-none cursor-pointer transition-colors"
            >
              {t('editExpense.cancel')}
            </button>
            <button
              type="button"
              onClick={() => onDelete(expense.id)}
              className="flex-1 h-11 bg-danger-soft hover:brightness-95 text-danger border-0 rounded-p-md font-bold text-[14px] leading-none cursor-pointer transition-all"
            >
              {t('editExpense.delete')}
            </button>
            <button
              type="submit"
              className="flex-1 h-11 bg-lagoon hover:bg-lagoon-deep active:scale-[0.97] text-white border-0 rounded-p-md font-bold text-[14px] leading-none cursor-pointer transition-all"
            >
              {t('editExpense.update')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
