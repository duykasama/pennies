import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '#/lib/constants'

export default function NotFound() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen overflow-y-auto bg-bg-base flex flex-col items-center px-6 pt-[88px] pb-28 text-center">
      <div className="flex items-center justify-center gap-2.5 mb-7">
        <span
          className="font-display font-bold text-sea-ink leading-none tracking-[-0.02em]"
          style={{ fontSize: 92 }}
        >
          4
        </span>
        <span
          className="rounded-full bg-lagoon flex items-center justify-center shrink-0"
          style={{ width: 82, height: 82 }}
        >
          <span
            className="font-display font-bold text-white leading-none"
            style={{ fontSize: 48 }}
          >
            ₫
          </span>
        </span>
        <span
          className="font-display font-bold text-sea-ink leading-none tracking-[-0.02em]"
          style={{ fontSize: 92 }}
        >
          4
        </span>
      </div>

      <h2 className="m-0 mb-2 font-bold text-[22px] leading-tight text-sea-ink">
        {t('notFound.title')}
      </h2>
      <p className="m-0 font-medium text-[14px] leading-relaxed text-sea-ink-soft max-w-[280px]">
        {t('notFound.messageMobile')}
      </p>

      <div className="w-full max-w-[280px] mt-9 flex flex-col gap-3">
        <button
          onClick={() => navigate({ to: ROUTES.DASHBOARD })}
          className="w-full h-12 bg-lagoon hover:bg-lagoon-deep active:scale-[0.98] text-white border-0 rounded-p-md font-bold text-[14px] leading-none cursor-pointer transition-all duration-150 ease-out"
        >
          {t('notFound.backDashboard')}
        </button>
        <button
          onClick={() => navigate({ to: ROUTES.EXPENSES })}
          className="w-full h-12 bg-white hover:bg-foam border border-hairline text-sea-ink rounded-p-md font-bold text-[14px] leading-none cursor-pointer transition-colors duration-150 ease-out"
        >
          {t('notFound.viewExpenses')}
        </button>
      </div>
    </div>
  )
}
