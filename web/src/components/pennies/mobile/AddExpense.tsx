import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ExpenseCreate } from '#/lib/pennies'
import { useCategories } from '#/hooks/useCategories'
import Header from '#/components/pennies/mobile/Header'
import { CategoryChip } from '#/components/pennies/Chips'
import { cn } from '#/lib/utils'

interface AddExpenseProps {
  onCancel: () => void
  onSave: (exp: ExpenseCreate) => void
}

export default function AddExpense({ onCancel, onSave }: AddExpenseProps) {
  const { t } = useTranslation()
  const categories = useCategories()
  const [amountStr, setAmountStr] = useState('')
  const [desc, setDesc] = useState('')
  const [cat, setCat] = useState<number>(categories[0]?.id ?? 1)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<{ amount?: string; desc?: string }>({})

  function handleSave() {
    const n = parseFloat(amountStr.replace(/,/g, ''))
    const newErrors: { amount?: string; desc?: string } = {}
    if (!amountStr || isNaN(n) || n <= 0) {
      newErrors.amount = t('addExpense.amountError')
    }
    if (!desc.trim()) {
      newErrors.desc = t('addExpense.descriptionError')
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const exp: ExpenseCreate = {
      id: 'e' + crypto.randomUUID().slice(0, 6),
      cat,
      title: desc.trim(),
      sub: note.trim(),
      amount: -n,
      date,
    }
    onSave(exp)
  }

  const inputBase =
    'w-full h-11 px-3.5 rounded-p-md bg-foam border border-transparent font-normal text-[14px] text-sea-ink outline-none transition-colors focus:bg-white focus:border-lagoon box-border'
  const inputError = 'bg-danger-soft border-danger text-danger'
  const labelBase = 'block font-bold text-[12px] leading-none text-sea-ink-soft mb-2'

  return (
    <>
      <Header variant="back" title={t('addExpense.title')} onBack={onCancel} />
      <div className="absolute inset-x-0 top-14 bottom-0 overflow-y-auto bg-bg-base">
        <div className="m-4 bg-white rounded-p-xl p-5 shadow-card">
          <h2 className="font-bold text-[22px] text-sea-ink mb-5">{t('addExpense.title')}</h2>

          {/* Amount */}
          <div className="mb-4">
            <label className={labelBase}>{t('addExpense.amount')}</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder={t('addExpense.amountPlaceholder')}
              value={amountStr}
              onChange={(e) => {
                setAmountStr(e.target.value)
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }))
              }}
              className={cn(inputBase, 'h-[52px] font-bold text-[22px]', errors.amount && inputError)}
            />
            {errors.amount && (
              <span className="block mt-1.5 font-medium text-[11px] text-danger">
                {errors.amount}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className={labelBase}>{t('addExpense.description')}</label>
            <input
              type="text"
              placeholder={t('addExpense.descriptionPlaceholder')}
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value)
                if (errors.desc) setErrors((prev) => ({ ...prev, desc: undefined }))
              }}
              className={cn(inputBase, errors.desc && inputError)}
            />
            {errors.desc && (
              <span className="block mt-1.5 font-medium text-[11px] text-danger">
                {errors.desc}
              </span>
            )}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className={labelBase}>{t('addExpense.category')}</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((c) => (
                <CategoryChip
                  key={c.id}
                  cat={c}
                  selected={cat === c.id}
                  onClick={() => setCat(c.id)}
                />
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className={labelBase}>{t('addExpense.date')}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className={labelBase}>{t('addExpense.note')}</label>
            <input
              type="text"
              placeholder={t('addExpense.notePlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-11 bg-foam hover:bg-sand text-sea-ink border-0 rounded-p-md font-bold text-[14px] cursor-pointer"
            >
              {t('addExpense.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 h-11 bg-lagoon hover:bg-lagoon-deep text-white border-0 rounded-p-md font-bold text-[14px] cursor-pointer transition-all active:scale-[0.97]"
            >
              {t('addExpense.submit')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
