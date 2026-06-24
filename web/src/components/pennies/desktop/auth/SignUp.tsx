import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AuthShell,
  DesktopField,
  DesktopPrimaryBtn,
  DesktopGoogleBtn,
  OrDivider,
} from './shared'

interface Props {
  onSubmit: (name: string, email: string, password: string) => void
  onGoogle: () => void
  onSignIn: () => void
  error?: string | null
}

export default function DesktopSignUp({
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
    <AuthShell
      title={t('auth.createAccount')}
      sub={t('auth.createSub')}
      footer={
        <>
          {t('auth.alreadyHaveAccount')}{' '}
          <button
            type="button"
            onClick={onSignIn}
            className="text-lagoon-deep font-bold bg-transparent border-0 cursor-pointer p-0"
          >
            {t('auth.signInBtn')}
          </button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(name, email, pw)
        }}
      >
        <DesktopField
          label={t('auth.fullName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('auth.namePlaceholder')}
        />
        <DesktopField
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.emailPlaceholder')}
        />
        <DesktopField
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
          <DesktopPrimaryBtn type="submit">
            {t('auth.createAccountBtn')}
          </DesktopPrimaryBtn>
        </div>
      </form>
      <OrDivider />
      <DesktopGoogleBtn label={t('auth.signUpWithGoogle')} onClick={onGoogle} />
    </AuthShell>
  )
}
