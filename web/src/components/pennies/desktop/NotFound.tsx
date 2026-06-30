import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '#/lib/constants'

export default function NotFound() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-12 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -right-6 -bottom-10 font-display font-bold select-none pointer-events-none"
        style={{ fontSize: 360, lineHeight: 1, color: 'var(--sea-ink)', opacity: 0.035 }}
      >
        ₫
      </div>

      <div className="relative flex items-center justify-center gap-4 mb-9">
        <span
          className="font-display font-bold text-sea-ink leading-none tracking-[-0.02em]"
          style={{ fontSize: 148 }}
        >
          4
        </span>
        <span
          className="rounded-full bg-lagoon flex items-center justify-center shadow-pop shrink-0"
          style={{ width: 132, height: 132 }}
        >
          <span
            className="font-display font-bold text-white leading-none"
            style={{ fontSize: 76 }}
          >
            ₫
          </span>
        </span>
        <span
          className="font-display font-bold text-sea-ink leading-none tracking-[-0.02em]"
          style={{ fontSize: 148 }}
        >
          4
        </span>
      </div>

      <h1 className="m-0 mb-3 font-bold text-[28px] leading-tight tracking-[-0.005em] text-sea-ink">
        {t('notFound.title')}
      </h1>
      <p className="m-0 mb-9 font-medium text-[15px] leading-relaxed text-sea-ink-soft max-w-[420px]">
        {t('notFound.messageDesktop')}
      </p>

      <div className="flex items-center gap-3 relative">
        <button
          onClick={() => navigate({ to: ROUTES.DASHBOARD })}
          className="h-11 px-6 bg-lagoon hover:bg-lagoon-deep active:scale-[0.99] text-white border-0 rounded-p-md font-bold text-[14px] leading-none cursor-pointer transition-all duration-150 ease-out"
        >
          {t('notFound.backDashboard')}
        </button>
        <button
          onClick={() => navigate({ to: ROUTES.EXPENSES })}
          className="h-11 px-6 bg-white hover:bg-foam border border-hairline text-sea-ink rounded-p-md font-bold text-[14px] leading-none cursor-pointer transition-colors duration-150 ease-out"
        >
          {t('notFound.viewExpenses')}
        </button>
      </div>
    </div>
  )
}
