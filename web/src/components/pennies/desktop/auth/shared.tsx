import { useTranslation } from 'react-i18next'
import GoogleG from '#/components/pennies/auth/GoogleG'

export const desktopInputCls =
  'w-full h-12 px-4 rounded-p-md bg-white border border-hairline font-sans text-[14px] leading-none text-sea-ink outline-none transition-colors duration-150 ease-out focus:border-lagoon focus:shadow-ring box-border'

export function DesktopField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  right,
}: {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  right?: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-2">
        <label className="block font-sans font-bold text-[13px] leading-none text-sea-ink">
          {label}
        </label>
        {right}
      </div>
      <input
        type={type}
        className={desktopInputCls}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export function DesktopPrimaryBtn({
  children,
  onClick,
  type = 'button',
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 bg-lagoon hover:bg-lagoon-deep active:scale-[0.99] text-white border-0 rounded-p-md font-sans font-bold text-[14px] leading-none cursor-pointer transition-all duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      {children}
    </button>
  )
}

export function DesktopGoogleBtn({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-12 rounded-p-md bg-white border border-hairline text-sea-ink font-sans font-bold text-[14px] flex items-center justify-center gap-2.5 cursor-pointer hover:bg-foam transition-colors duration-150 ease-out"
    >
      <GoogleG />
      <span>{label}</span>
    </button>
  )
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px" style={{ background: 'var(--hairline)' }} />
      <span className="font-sans font-bold text-[10px] text-sea-ink-muted uppercase tracking-[0.12em]">
        or
      </span>
      <div className="flex-1 h-px" style={{ background: 'var(--hairline)' }} />
    </div>
  )
}

function BrandPanel() {
  const { t } = useTranslation()
  return (
    <div className="bg-sea-ink text-white p-12 flex flex-col relative overflow-hidden min-h-screen">
      <div
        aria-hidden="true"
        className="absolute -right-8 -bottom-12 font-display font-bold text-white/[0.04] select-none pointer-events-none"
        style={{ fontSize: 320, lineHeight: 1 }}
      >
        ₫
      </div>

      <div className="flex items-center justify-between relative">
        <div className="font-display font-bold text-[28px] leading-none tracking-[-0.015em]">
          Pennies
        </div>
        <span className="font-sans font-bold text-[12px] text-lagoon-mist">
          EN · VI
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center relative">
        <div className="font-display font-bold text-[48px] leading-[1.05] tracking-[-0.02em] text-white max-w-[400px] text-balance">
          {t('auth.tagline')}
        </div>
        <p
          className="mt-5 font-sans font-medium text-[15px] leading-relaxed text-lagoon-mist max-w-[400px]"
          style={{ opacity: 0.78 }}
        >
          {t('auth.taglineSub')}
        </p>

        <div className="mt-9 inline-flex items-center gap-4 bg-white/[0.06] backdrop-blur-sm rounded-p-md px-4 py-3 max-w-[280px] border border-white/[0.08]">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[16px] leading-none"
            style={{ background: 'var(--cat-food)' }}
          >
            🍴
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-sans font-bold text-[13px] leading-none text-white">
              Lunch · pho place
            </div>
            <div className="font-sans font-medium text-[11px] leading-none text-lagoon-mist tabular-nums">
              ₫65.000 · today
            </div>
          </div>
        </div>
      </div>

      <div className="font-sans font-medium text-[12px] text-white/40 relative">
        {t('auth.copyright')}
      </div>
    </div>
  )
}

export function AuthShell({
  title,
  sub,
  children,
  footer,
}: {
  title: string
  sub: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[540px_1fr]">
      <BrandPanel />
      <div className="bg-bg-base p-12 flex flex-col items-center justify-center min-h-screen">
        <div className="w-[400px]">
          <h1 className="m-0 mb-2 font-sans font-bold text-[26px] leading-tight tracking-[-0.005em] text-sea-ink">
            {title}
          </h1>
          <p className="m-0 mb-7 font-sans font-medium text-[14px] leading-relaxed text-sea-ink-soft">
            {sub}
          </p>
          {children}
          {footer && (
            <div className="mt-6 text-center font-sans font-medium text-[13px] text-sea-ink-soft">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function CelebrateShell({
  glyph,
  title,
  sub,
  children,
}: {
  glyph: React.ReactNode
  title: string
  sub: React.ReactNode
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-[540px_1fr]">
      <div className="bg-sea-ink text-white p-12 flex flex-col relative overflow-hidden min-h-screen">
        <div
          aria-hidden="true"
          className="absolute -right-8 -bottom-12 font-display font-bold text-white/[0.04] select-none pointer-events-none"
          style={{ fontSize: 320, lineHeight: 1 }}
        >
          ₫
        </div>
        <div className="flex items-center justify-between relative">
          <div className="font-display font-bold text-[28px] leading-none tracking-[-0.015em]">
            Pennies
          </div>
          <span className="font-sans font-bold text-[12px] text-lagoon-mist">
            EN · VI
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-center relative">
          <div className="font-display font-bold text-[48px] leading-[1.05] tracking-[-0.02em] text-white max-w-[400px]">
            {t('auth.tagline')}
          </div>
        </div>
        <div className="font-sans font-medium text-[12px] text-white/40 relative">
          {t('auth.copyright')}
        </div>
      </div>

      <div className="bg-bg-base p-12 flex flex-col items-center justify-center text-center min-h-screen">
        <div className="w-[400px] flex flex-col items-center">
          <div className="w-[128px] h-[128px] rounded-full bg-lagoon flex items-center justify-center mb-7">
            {glyph}
          </div>
          <h1 className="m-0 mb-3 font-sans font-bold text-[28px] leading-tight tracking-[-0.005em] text-sea-ink">
            {title}
          </h1>
          <p className="m-0 mb-8 font-sans font-medium text-[15px] leading-relaxed text-sea-ink-soft max-w-[340px]">
            {sub}
          </p>
          {children}
        </div>
      </div>
    </div>
  )
}
