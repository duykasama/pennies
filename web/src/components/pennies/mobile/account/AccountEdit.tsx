import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { mobileInputCls } from '#/components/pennies/mobile/auth/shared'
import Header from '#/components/pennies/mobile/Header'
import type { UserProfile } from '#/lib/auth'

interface Props {
  user: UserProfile
  onCancel: () => void
  onSaveName: (name: string) => Promise<void>
  onRequestEmail: (email: string) => Promise<void>
  onConfirmEmail: (code: string) => Promise<void>
  nameError: string | null
  emailError: string | null
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  help,
  error,
}: {
  label: string
  type?: string
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
        type={type}
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

function NameCard({
  user,
  onSaveName,
  externalError,
}: {
  user: UserProfile
  onSaveName: (n: string) => Promise<void>
  externalError: string | null
}) {
  const { t } = useTranslation()
  const [name, setName] = useState(user.displayName)
  const [baseName, setBaseName] = useState(user.displayName)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const dirty = name.trim() !== baseName

  useEffect(() => {
    setError(externalError)
  }, [externalError])

  async function submit() {
    if (!name.trim()) {
      setError(t('account.nameError'))
      return
    }
    setError(null)
    try {
      await onSaveName(name.trim())
      setBaseName(name.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // error surfaced via externalError prop
    }
  }

  return (
    <div className="mx-4 mb-3 bg-white rounded-p-xl p-5 shadow-card">
      <div className="font-sans font-bold text-[15px] leading-tight text-sea-ink mb-4">
        {t('account.nameSection')}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (dirty) submit()
        }}
      >
        <Field
          label={t('account.fullName')}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          placeholder={t('auth.namePlaceholder')}
          error={error}
        />
        <div className="flex items-center justify-end gap-3 mt-1">
          {saved && (
            <span className="font-sans font-medium text-[12px] text-success">
              {t('account.nameSaved')}
            </span>
          )}
          <button
            type="submit"
            onClick={submit}
            disabled={!dirty}
            className="h-10 px-5 bg-lagoon hover:bg-lagoon-deep active:scale-[0.97] text-white border-0 rounded-p-md font-sans font-bold text-[13px] leading-tight cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {t('account.saveName')}
          </button>
        </div>
      </form>
    </div>
  )
}

function CodeInput({
  value,
  onChange,
}: {
  value: string[]
  onChange: (v: string[]) => void
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  function setAt(i: number, v: string) {
    const ch = v.replace(/\D/g, '').slice(-1)
    const next = [...value]
    next[i] = ch
    onChange(next)
    if (ch && i < 5) refs.current[i + 1]?.focus()
  }
  function onKey(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !value[i] && i > 0)
      refs.current[i - 1]?.focus()
  }
  function onPaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const digits = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
      .split('')
    if (!digits.length) return
    const next = ['', '', '', '', '', '']
    digits.forEach((d, i) => {
      next[i] = d
    })
    onChange(next)
    refs.current[Math.min(digits.length, 5)]?.focus()
  }
  return (
    <div className="flex gap-1.5 mb-4">
      {value.map((c, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          value={c}
          onChange={(e) => setAt(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          onPaste={onPaste}
          inputMode="numeric"
          maxLength={1}
          className="flex-1 min-w-0 h-12 rounded-p-md bg-foam border-2 border-transparent text-center font-sans font-bold text-[20px] text-sea-ink outline-none focus:bg-white focus:border-lagoon box-border tabular-nums"
        />
      ))}
    </div>
  )
}

function EmailCard({
  user,
  onRequestEmail,
  onConfirmEmail,
  externalError,
}: {
  user: UserProfile
  onRequestEmail: (e: string) => Promise<void>
  onConfirmEmail: (code: string) => Promise<void>
  externalError: string | null
}) {
  const { t } = useTranslation()
  const [email, setEmail] = useState(user.email)
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const dirty = email.trim() !== user.email
  const complete = code.every((c) => c)

  useEffect(() => {
    setError(externalError)
  }, [externalError])

  async function requestCode() {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(t('account.emailError'))
      return
    }
    setError(null)
    try {
      await onRequestEmail(email.trim())
      setCodeSent(true)
    } catch {
      // error surfaced via externalError prop
    }
  }

  async function confirmCode() {
    setError(null)
    setLoading(true)
    try {
      await onConfirmEmail(code.join(''))
      setSaved(true)
      setCode(['', '', '', '', '', ''])
      setCodeSent(false)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // error surfaced via externalError prop
    } finally {
      setLoading(false)
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
    setError(null)
    if (codeSent) setCodeSent(false)
  }

  return (
    <div className="mx-4 mb-3 bg-white rounded-p-xl p-5 shadow-card">
      <div className="font-sans font-bold text-[15px] leading-tight text-sea-ink mb-4">
        {t('account.emailSection')}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          codeSent
            ? complete && !loading && confirmCode()
            : dirty && requestCode()
        }}
      >
        <Field
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder={t('auth.emailPlaceholder')}
          error={error}
          help={!error && !codeSent ? t('account.confirmEmailNote') : undefined}
        />
        {codeSent && (
          <>
            <div className="mb-2 font-sans font-bold text-[12px] leading-tight text-sea-ink-soft">
              {t('account.confirmationCode')}
            </div>
            <CodeInput value={code} onChange={setCode} />
            <div className="-mt-2 mb-4 font-sans font-medium text-[11px] leading-tight text-sea-ink-soft">
              {t('auth.didntGetCode')}{' '}
              <button
                type="button"
                onClick={requestCode}
                className="bg-transparent border-0 text-lagoon-deep font-bold text-[11px] cursor-pointer p-0 underline"
              >
                {t('auth.resendCode')}
              </button>
            </div>
          </>
        )}
        <div className="flex items-center justify-end gap-3 mt-1">
          {saved && (
            <span className="font-sans font-medium text-[12px] text-success">
              {t('account.emailSaved')}
            </span>
          )}
          {!codeSent ? (
            <button
              type="submit"
              onClick={requestCode}
              disabled={!dirty}
              className="h-10 px-5 bg-lagoon hover:bg-lagoon-deep active:scale-[0.97] text-white border-0 rounded-p-md font-sans font-bold text-[13px] leading-tight cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {t('account.saveEmail')}
            </button>
          ) : (
            <button
              type="submit"
              onClick={confirmCode}
              disabled={!complete || loading}
              className="h-10 px-5 bg-lagoon hover:bg-lagoon-deep active:scale-[0.97] text-white border-0 rounded-p-md font-sans font-bold text-[13px] leading-tight cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {t('account.confirmEmail')}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default function MobileAccountEdit({
  user,
  onCancel,
  onSaveName,
  onRequestEmail,
  onConfirmEmail,
  nameError,
  emailError,
}: Props) {
  const { t } = useTranslation()

  return (
    <>
      <Header variant="back" title={t('account.editTitle')} onBack={onCancel} />
      <div className="absolute inset-x-0 top-14 bottom-0 overflow-y-auto bg-bg-base pt-4 pb-6">
        <NameCard
          user={user}
          onSaveName={onSaveName}
          externalError={nameError}
        />
        <EmailCard
          user={user}
          onRequestEmail={onRequestEmail}
          onConfirmEmail={onConfirmEmail}
          externalError={emailError}
        />
      </div>
    </>
  )
}
