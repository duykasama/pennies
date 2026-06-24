import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthShell, DesktopField, DesktopPrimaryBtn, DesktopGoogleBtn, OrDivider } from './shared'

interface Props {
  onSubmit: (email: string, password: string) => void
  onGoogle: () => void
  onSignUp: () => void
  onForgot: () => void
  error?: string | null
}

export default function DesktopSignIn({ onSubmit, onGoogle, onSignUp, onForgot, error }: Props) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  return (
    <AuthShell
      title={t('auth.signIn')}
      sub={t('auth.signInSub')}
      footer={
        <>
          {t('auth.newHere')}{' '}
          <button
            type="button"
            onClick={onSignUp}
            className="text-lagoon-deep font-bold bg-transparent border-0 cursor-pointer p-0"
          >
            {t('auth.createAccountBtn')}
          </button>
        </>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(email, pw) }}>
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
          placeholder="••••••••"
          right={
            <button
              type="button"
              onClick={onForgot}
              className="font-sans font-bold text-[12px] text-lagoon-deep bg-transparent border-0 cursor-pointer p-0"
            >
              {t('auth.forgot')}
            </button>
          }
        />
        {error && (
          <p className="text-red-500 text-[13px] font-medium mb-2">{error}</p>
        )}
        <DesktopPrimaryBtn type="submit">{t('auth.signInBtn')}</DesktopPrimaryBtn>
      </form>
      <OrDivider />
      <DesktopGoogleBtn label={t('auth.signInWithGoogle')} onClick={onGoogle} />
    </AuthShell>
  )
}
