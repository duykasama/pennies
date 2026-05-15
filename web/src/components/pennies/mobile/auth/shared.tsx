import GoogleG from '#/components/pennies/auth/GoogleG'

export const mobileInputCls =
  'w-full h-12 px-3.5 rounded-p-md bg-foam border border-transparent font-sans text-[14px] leading-none text-sea-ink outline-none transition-colors duration-150 ease-out focus:bg-white focus:border-lagoon focus:shadow-ring box-border'

export function AuthHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="text-center pt-9 pb-5 px-6">
      <div className="font-display font-bold text-[32px] leading-none tracking-[-0.015em] text-sea-ink">
        Pennies
      </div>
      <div className="mt-4 font-sans font-bold text-[20px] leading-tight text-sea-ink">{title}</div>
      {sub && (
        <div className="mt-2 font-sans font-medium text-[13px] leading-snug text-sea-ink-soft max-w-[300px] mx-auto">
          {sub}
        </div>
      )}
    </div>
  )
}

export function AuthInput({
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
        <label className="block font-sans font-bold text-[12px] leading-none text-sea-ink-soft">
          {label}
        </label>
        {right}
      </div>
      <input
        type={type}
        className={mobileInputCls}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export function PrimaryBtn({
  children,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full h-12 bg-lagoon hover:bg-lagoon-deep active:scale-[0.98] text-white border-0 rounded-p-md font-sans font-bold text-[14px] leading-none cursor-pointer transition-all duration-150 ease-out"
    >
      {children}
    </button>
  )
}

export function GoogleButton({ label, onClick }: { label: string; onClick?: () => void }) {
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

export function GlyphCircle({ children, size = 112 }: { children: React.ReactNode; size?: number }) {
  return (
    <div
      className="rounded-full bg-lagoon flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  )
}
