import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { logoutFn } from '#/lib/auth'
import { ROUTES } from '#/lib/constants'
import Avatar from '#/components/pennies/account/Avatar'
import type { UserProfile } from '#/lib/auth'

interface Props {
  user: UserProfile
}

function FieldRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-4 ${last ? '' : 'border-b border-hairline'}`}>
      <span className="font-sans font-medium text-[13px] leading-tight text-sea-ink-soft">{label}</span>
      <span className="font-sans font-bold text-[14px] leading-tight text-sea-ink">{value}</span>
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
    <div className="bg-white rounded-p-md shadow-card px-7 py-6 mb-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="m-0 font-sans font-bold text-[16px] leading-tight text-sea-ink">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

export default function DesktopAccountView({ user }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  async function handleSignOut() {
    await logoutFn()
    navigate({ to: ROUTES.AUTH_SIGN_IN })
  }

  return (
    <div className="px-12 py-9">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <h1 className="m-0 mb-6 font-sans font-bold text-[26px] leading-tight tracking-[-0.005em] text-sea-ink">
          {t('account.title')}
        </h1>

        {/* Profile header */}
        <div className="bg-white rounded-p-md shadow-card px-7 py-6 mb-5 flex items-center gap-5">
          <Avatar displayName={user.displayName} size={64} />
          <div className="flex flex-col gap-1.5">
            <div className="font-sans font-bold text-[20px] leading-tight text-sea-ink">{user.displayName}</div>
            <div className="font-sans font-medium text-[14px] leading-tight text-sea-ink-soft">{user.email}</div>
            <div className="font-sans font-medium text-[12px] leading-tight text-sea-ink-muted mt-0.5">
              {t('account.planFree')} plan
            </div>
          </div>
        </div>

        <SectionCard
          title={t('account.details')}
          action={
            <button
              type="button"
              onClick={() => navigate({ to: ROUTES.ACCOUNT_EDIT })}
              className="bg-transparent border-0 cursor-pointer font-sans font-bold text-[13px] leading-tight text-lagoon-deep hover:text-sea-ink transition-colors duration-150 p-0"
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
              className="bg-transparent border-0 cursor-pointer font-sans font-bold text-[13px] leading-tight text-lagoon-deep hover:text-sea-ink transition-colors duration-150 p-0"
            >
              {t('account.change')}
            </button>
          }
        >
          <FieldRow label={t('account.password')} value="••••••••••" last />
        </SectionCard>

        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={handleSignOut}
            className="h-10 px-[18px] bg-white text-sea-ink hover:bg-foam border-0 rounded-p-sm font-sans font-bold text-[13px] leading-tight cursor-pointer shadow-card transition-colors duration-150"
          >
            {t('account.signOut')}
          </button>
        </div>
      </div>
    </div>
  )
}
