import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CATEGORIES } from '#/lib/pennies'
import type { ExpenseCreate } from '#/lib/pennies'
import { cn } from '#/lib/utils'

interface AddExpenseProps {
  onCancel: () => void
  onSave: (exp: ExpenseCreate) => void
}

export default function AddExpense({ onCancel, onSave }: AddExpenseProps) {
  const { t } = useTranslation()
  const [amountStr, setAmountStr] = useState('')
  const [desc, setDesc] = useState('')
  const [cat, setCat] = useState('food')
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
    'w-full h-11 px-3.5 rounded-p-sm bg-white border border-transparent font-normal text-[14px] text-sea-ink outline-none transition-colors focus:border-lagoon box-border'
  const inputError = 'bg-[#fff6f6] border-danger text-danger'
  const labelBase = 'block font-bold text-[12px] leading-none text-sea-ink-soft mb-2'

  return (
    <div>
      {/* Back button */}
      <button
        type="button"
        onClick={onCancel}
        className="font-medium text-[14px] text-lagoon-deep bg-transparent border-0 cursor-pointer mt-4 ml-12 p-0 block"
      >
        {t('addExpense.back')}
      </button>

      {/* Form card */}
      <div className="flex justify-center px-12 py-9">
        <div className="w-[480px] bg-foam rounded-p-md p-8 shadow-card">
          <h1 className="font-bold text-[24px] text-sea-ink mb-6 mt-0">{t('addExpense.title')}</h1>

          {/* Amount */}
          <div className="mb-5">
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
          <div className="mb-5">
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
          <div className="mb-5">
            <label className={labelBase}>{t('addExpense.category')}</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat(c.id)}
                  className={cn(
                    'h-8 px-3.5 rounded-full font-bold text-[12px] border-2 cursor-pointer inline-flex items-center gap-1.5 active:scale-[0.97] transition-transform',
                    cat === c.id ? 'border-sea-ink' : 'border-transparent',
                  )}
                  style={{ background: c.dot, color: c.ink }}
                >
                  <span>{c.emoji}</span>
                  <span>{(t as (k: string) => string)(`categories.${c.id}.long`)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="mb-5">
            <label className={labelBase}>{t('addExpense.date')}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* Note */}
          <div className="mb-7">
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
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="h-11 px-6 bg-white hover:bg-foam text-sea-ink border-0 rounded-p-md font-bold text-[14px] cursor-pointer shadow-card"
            >
              {t('addExpense.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-11 px-6 bg-lagoon hover:bg-lagoon-deep text-white border-0 rounded-p-md font-bold text-[14px] cursor-pointer transition-all active:scale-[0.97]"
            >
              {t('addExpense.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
