import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthHeader, PrimaryBtn } from './shared'

interface Props {
  email: string
  onVerify: () => void
  onResend: () => void
  onBack: () => void
}

export default function MobileTwoFactor({ email, onVerify, onResend, onBack }: Props) {
  const { t } = useTranslation()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function setAt(i: number, v: string) {
    const ch = v.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[i] = ch
    setCode(next)
    if (ch && i < 5) refs.current[i + 1]?.focus()
  }

  function onKey(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !code[i] && i > 0) refs.current[i - 1]?.focus()
  }

  return (
    <div className="absolute inset-0 overflow-y-auto bg-bg-base">
      <div className="px-5 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="bg-transparent border-0 text-lagoon-deep font-sans font-medium text-[14px] cursor-pointer p-0"
        >
          ← {t('addExpense.back').replace('← ', '')}
        </button>
      </div>
      <AuthHeader title={t('auth.twoFactor')} sub={`${t('auth.twoFactorSub')} ${email}.`} />
      <div className="mx-4 bg-white rounded-p-xl p-5 shadow-card">
        <div className="flex gap-2 justify-center mb-5">
          {code.map((c, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el }}
              value={c}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="w-11 h-14 rounded-p-md bg-foam border-2 border-transparent text-center font-sans font-bold text-[22px] text-sea-ink outline-none focus:bg-white focus:border-lagoon box-border tabular-nums"
            />
          ))}
        </div>
        <PrimaryBtn onClick={onVerify}>{t('auth.verify')}</PrimaryBtn>
        <div className="text-center mt-4 font-sans font-medium text-[12px] text-sea-ink-soft">
          {t('auth.didntGetCode')}{' '}
          <button
            type="button"
            onClick={onResend}
            className="bg-transparent border-0 text-lagoon-deep font-bold text-[12px] cursor-pointer p-0 underline"
          >
            {t('auth.resendCode')}
          </button>
        </div>
      </div>
      <div className="text-center py-5 font-sans font-medium text-[12px] text-sea-ink-muted">
        {t('auth.codesExpire')}
      </div>
    </div>
  )
}
