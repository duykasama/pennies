import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthShell, DesktopPrimaryBtn } from './shared'

interface Props {
  email: string
  onVerify: () => void
  onResend: () => void
  onBack: () => void
}

export default function DesktopTwoFactor({
  email,
  onVerify,
  onResend,
  onBack,
}: Props) {
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
    <AuthShell
      title={t('auth.twoFactor')}
      sub={
        <>
          {t('auth.twoFactorSub')}{' '}
          <strong className="text-sea-ink font-bold">{email}</strong>.
        </>
      }
      footer={
        <button
          type="button"
          onClick={onBack}
          className="bg-transparent border-0 text-lagoon-deep font-bold text-[13px] cursor-pointer p-0"
        >
          {t('auth.useDifferentMethod')}
        </button>
      }
    >
      <div className="mb-2 font-sans font-bold text-[13px] leading-none text-sea-ink">
        {t('auth.verifyCode')}
      </div>
      <div className="flex gap-2.5 mb-5">
        {code.map((c, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            value={c}
            onChange={(e) => setAt(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="w-[58px] h-[64px] rounded-p-md bg-white border-2 border-hairline text-center font-sans font-bold text-[26px] text-sea-ink outline-none focus:border-lagoon focus:shadow-ring box-border tabular-nums"
          />
        ))}
      </div>
      <DesktopPrimaryBtn onClick={onVerify}>
        {t('auth.verifyAndSignIn')}
      </DesktopPrimaryBtn>
      <div className="text-center mt-4 font-sans font-medium text-[13px] text-sea-ink-soft">
        {t('auth.didntGetCode')}{' '}
        <button
          type="button"
          onClick={onResend}
          className="bg-transparent border-0 text-lagoon-deep font-bold text-[13px] cursor-pointer p-0 underline"
        >
          {t('auth.resendCode')}
        </button>
      </div>
    </AuthShell>
  )
}
