import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AuthHeader,
  AuthInput,
  PrimaryBtn,
  GoogleButton,
  OrDivider,
} from './shared'

interface Props {
  onSubmit: (email: string, password: string) => void
  onGoogle: () => void
  onSignUp: () => void
  onForgot: () => void
  error?: string | null
}

export default function MobileSignIn({
  onSubmit,
  onGoogle,
  onSignUp,
  onForgot,
  error,
}: Props) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  return (
    <div className="absolute inset-0 overflow-y-auto bg-bg-base">
      <AuthHeader title={t('auth.signIn')} sub={t('auth.signInSub')} />
      <div className="mx-4 bg-white rounded-p-xl p-5 shadow-card">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(email, pw)
          }}
        >
          <AuthInput
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder')}
          />
          <AuthInput
            label={t('auth.password')}
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
            right={
              <button
                type="button"
                onClick={onForgot}
                className="font-sans font-bold text-[11px] text-lagoon-deep bg-transparent border-0 cursor-pointer p-0"
              >
                {t('auth.forgot')}
              </button>
            }
          />
          {error && (
            <p className="text-red-500 text-[13px] font-medium mb-2">{error}</p>
          )}
          <PrimaryBtn type="submit">{t('auth.signInBtn')}</PrimaryBtn>
        </form>
        <OrDivider />
        <GoogleButton label={t('auth.signInWithGoogle')} onClick={onGoogle} />
      </div>
      <div className="text-center py-5 font-sans font-medium text-[13px] text-sea-ink-soft">
        {t('auth.newHere')}{' '}
        <button
          type="button"
          onClick={onSignUp}
          className="text-lagoon-deep font-bold bg-transparent border-0 cursor-pointer p-0"
        >
          {t('auth.createAccountBtn')}
        </button>
      </div>
    </div>
  )
}
