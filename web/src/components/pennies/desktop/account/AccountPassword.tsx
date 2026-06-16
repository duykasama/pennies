import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { desktopInputCls } from '#/components/pennies/desktop/auth/shared'

interface Props {
  onCancel: () => void
  onSave: (data: { current: string; next: string }) => void
  error?: string | null
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  help,
  error,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  help?: string
  error?: string | null
}) {
  return (
    <div className="mb-4">
      <label className="block font-sans font-bold text-[13px] leading-tight text-sea-ink mb-2">{label}</label>
      <input
        type="password"
        className={`${desktopInputCls} ${error ? 'bg-[#fff6f6] border-danger text-danger' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error ? (
        <span className="block mt-1.5 font-sans font-medium text-[11px] leading-tight text-danger">{error}</span>
      ) : help ? (
        <span className="block mt-1.5 font-sans font-medium text-[12px] leading-snug text-sea-ink-soft">{help}</span>
      ) : null}
    </div>
  )
}

export default function DesktopAccountPassword({ onCancel, onSave, error }: Props) {
  const { t } = useTranslation()
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [conf, setConf] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function submit() {
    const errs: Record<string, string> = {}
    if (!cur) errs.cur = t('account.currentPasswordError')
    if (next.length < 8) errs.next = t('account.minCharsError')
    if (conf !== next) errs.conf = t('account.passwordMatchError')
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({ current: cur, next })
  }

  return (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="inline-block mt-4 ml-12 font-sans font-medium text-[14px] leading-tight text-lagoon-deep hover:text-sea-ink bg-transparent border-0 cursor-pointer p-0"
      >
        {t('account.back')}
      </button>
      <div className="flex justify-center px-12 py-9">
        <div className="w-[480px] bg-foam rounded-p-md p-8 shadow-card">
          <h1 className="m-0 mb-1.5 font-sans font-bold text-[24px] leading-tight text-sea-ink">
            {t('account.passwordTitle')}
          </h1>
          <p className="m-0 mb-6 font-sans font-medium text-[14px] leading-relaxed text-sea-ink-soft">
            {t('account.passwordSub')}
          </p>

          <Field
            label={t('account.currentPassword')}
            value={cur}
            onChange={(e) => { setCur(e.target.value); setErrors({ ...errors, cur: '' }) }}
            placeholder="••••••••"
            error={errors.cur}
          />
          <Field
            label={t('account.newPassword')}
            value={next}
            onChange={(e) => { setNext(e.target.value); setErrors({ ...errors, next: '' }) }}
            placeholder={t('auth.passwordPlaceholder')}
            error={errors.next}
            help={!errors.next ? 'Use at least 8 characters.' : undefined}
          />
          <Field
            label={t('account.confirmPassword')}
            value={conf}
            onChange={(e) => { setConf(e.target.value); setErrors({ ...errors, conf: '' }) }}
            placeholder="Re-enter new password"
            error={errors.conf}
          />

          {error && (
            <p className="text-sea-ink-soft text-[13px] font-medium mb-3">{error}</p>
          )}

          <div className="flex gap-2.5 justify-end mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="h-10 px-[22px] bg-white text-sea-ink hover:bg-foam border-0 rounded-p-sm font-sans font-bold text-[13px] leading-tight cursor-pointer shadow-card transition-colors duration-150"
            >
              {t('editExpense.cancel')}
            </button>
            <button
              type="button"
              onClick={submit}
              className="h-10 px-[22px] bg-lagoon hover:bg-lagoon-deep text-white border-0 rounded-p-sm font-sans font-bold text-[13px] leading-tight cursor-pointer transition-colors duration-150 whitespace-nowrap"
            >
              {t('account.updatePassword')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
