import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { logoutFn } from '#/lib/auth'
import { ROUTES } from '#/lib/constants'
import Avatar from '#/components/pennies/account/Avatar'
import Header from '#/components/pennies/mobile/Header'
import type { UserProfile } from '#/lib/auth'

interface Props {
  user: UserProfile
  onBack: () => void
}

function FieldRow({
  label,
  value,
  last,
}: {
  label: string
  value: string
  last?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between py-3.5 ${last ? '' : 'border-b border-hairline'}`}
    >
      <span className="font-sans font-medium text-[13px] leading-tight text-sea-ink-soft">
        {label}
      </span>
      <span className="font-sans font-bold text-[14px] leading-tight text-sea-ink">
        {value}
      </span>
    </div>
  )
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mx-4 mb-4 bg-white rounded-p-xl shadow-card px-5 py-1">
      <div className="flex items-center justify-between pt-4 pb-1">
        <h2 className="m-0 font-sans font-bold text-[15px] leading-tight text-sea-ink">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  )
}

export default function MobileAccountView({ user, onBack }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  async function handleSignOut() {
    await logoutFn()
    navigate({ to: ROUTES.AUTH_SIGN_IN })
  }

  return (
    <>
      <Header variant="back" title={t('account.title')} onBack={onBack} />
      <div className="absolute inset-x-0 top-14 bottom-0 overflow-y-auto bg-bg-base">
        <div className="flex flex-col items-center text-center pt-7 pb-5 px-6">
          <Avatar displayName={user.displayName} size={72} />
          <div className="mt-3.5 font-sans font-bold text-[20px] leading-tight text-sea-ink">
            {user.displayName}
          </div>
          <div className="mt-2 font-sans font-medium text-[13px] leading-tight text-sea-ink-soft">
            {user.email}
          </div>
        </div>

        <SectionCard
          title={t('account.details')}
          action={
            <button
              type="button"
              onClick={() => navigate({ to: ROUTES.ACCOUNT_EDIT })}
              className="bg-transparent border-0 cursor-pointer font-sans font-bold text-[12px] leading-tight text-lagoon-deep p-0"
            >
              {t('account.edit')}
            </button>
          }
        >
          <FieldRow label={t('account.fullName')} value={user.displayName} />
          <FieldRow label={t('auth.email')} value={user.email} last />
        </SectionCard>

        <SectionCard
          title={t('account.password')}
          action={
            <button
              type="button"
              onClick={() => navigate({ to: ROUTES.ACCOUNT_PASSWORD })}
              className="bg-transparent border-0 cursor-pointer font-sans font-bold text-[12px] leading-tight text-lagoon-deep p-0"
            >
              {t('account.change')}
            </button>
          }
        >
          <FieldRow label={t('account.password')} value="••••••••" last />
        </SectionCard>

        <div className="px-4 pb-8 pt-1">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full h-11 bg-white hover:bg-foam text-sea-ink border-0 rounded-p-md font-sans font-bold text-[14px] leading-tight cursor-pointer shadow-card transition-colors duration-150"
          >
            {t('account.signOut')}
          </button>
        </div>
      </div>
    </>
  )
}
