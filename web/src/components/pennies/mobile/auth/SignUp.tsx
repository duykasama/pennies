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
  onSubmit: (name: string, email: string, password: string) => void
  onGoogle: () => void
  onSignIn: () => void
  error?: string | null
}

export default function MobileSignUp({
  onSubmit,
  onGoogle,
  onSignIn,
  error,
}: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  return (
    <div className="absolute inset-0 overflow-y-auto bg-bg-base">
      <AuthHeader title={t('auth.createAccount')} sub={t('auth.createSub')} />
      <div className="mx-4 bg-white rounded-p-xl p-5 shadow-card">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(name, email, pw)
          }}
        >
          <AuthInput
            label={t('auth.fullName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.namePlaceholder')}
          />
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
            placeholder={t('auth.passwordPlaceholder')}
          />
          {error && (
            <p className="text-red-500 text-[13px] font-medium mb-2">{error}</p>
          )}
          <div className="mt-1">
            <PrimaryBtn type="submit">{t('auth.createAccountBtn')}</PrimaryBtn>
          </div>
        </form>
        <OrDivider />
        <GoogleButton label={t('auth.signUpWithGoogle')} onClick={onGoogle} />
      </div>
      <div className="text-center py-5 font-sans font-medium text-[13px] text-sea-ink-soft">
        {t('auth.alreadyHaveAccount')}{' '}
        <button
          type="button"
          onClick={onSignIn}
          className="text-lagoon-deep font-bold bg-transparent border-0 cursor-pointer p-0"
        >
          {t('auth.signInBtn')}
        </button>
      </div>
    </div>
  )
}
