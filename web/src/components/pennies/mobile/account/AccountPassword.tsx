import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mobileInputCls } from '#/components/pennies/mobile/auth/shared'
import Header from '#/components/pennies/mobile/Header'

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
      <label className="block font-sans font-bold text-[12px] leading-tight text-sea-ink-soft mb-2">
        {label}
      </label>
      <input
        type="password"
        className={`${mobileInputCls} ${error ? 'bg-danger-soft border-danger text-danger' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error ? (
        <span className="block mt-1.5 font-sans font-medium text-[11px] leading-tight text-danger">
          {error}
        </span>
      ) : help ? (
        <span className="block mt-1.5 font-sans font-medium text-[11px] leading-snug text-sea-ink-soft">
          {help}
        </span>
      ) : null}
    </div>
  )
}

export default function MobileAccountPassword({
  onCancel,
  onSave,
  error,
}: Props) {
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
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    onSave({ current: cur, next })
  }

  return (
    <>
      <Header
        variant="back"
        title={t('account.passwordTitle')}
        onBack={onCancel}
      />
      <div className="absolute inset-x-0 top-14 bottom-0 overflow-y-auto bg-bg-base">
        <div className="m-4 bg-white rounded-p-xl p-5 shadow-card">
          <div className="font-sans font-bold text-[22px] leading-tight text-sea-ink mb-1.5">
            {t('account.passwordTitle')}
          </div>
          <p className="m-0 mb-5 font-sans font-medium text-[13px] leading-snug text-sea-ink-soft">
            {t('account.passwordSub')}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <Field
              label={t('account.currentPassword')}
              value={cur}
              onChange={(e) => {
                setCur(e.target.value)
                setErrors({ ...errors, cur: '' })
              }}
              placeholder="••••••••"
              error={errors.cur}
            />
            <Field
              label={t('account.newPassword')}
              value={next}
              onChange={(e) => {
                setNext(e.target.value)
                setErrors({ ...errors, next: '' })
              }}
              placeholder={t('auth.passwordPlaceholder')}
              error={errors.next}
              help={!errors.next ? t('account.minCharsError') + '.' : undefined}
            />
            <Field
              label={t('account.confirmPassword')}
              value={conf}
              onChange={(e) => {
                setConf(e.target.value)
                setErrors({ ...errors, conf: '' })
              }}
              placeholder="Re-enter new password"
              error={errors.conf}
            />

            {error && (
              <p className="text-sea-ink-soft text-[13px] font-medium mb-3">
                {error}
              </p>
            )}

            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 h-11 bg-foam hover:bg-sand text-sea-ink border-0 rounded-p-md font-sans font-bold text-[14px] leading-tight cursor-pointer transition-colors duration-150"
              >
                {t('editExpense.cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 h-11 bg-lagoon hover:bg-lagoon-deep active:scale-[0.97] text-white border-0 rounded-p-md font-sans font-bold text-[14px] leading-tight cursor-pointer transition-all duration-150"
              >
                {t('account.updatePassword')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
