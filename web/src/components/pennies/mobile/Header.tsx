import { useTranslation } from 'react-i18next'
import LanguagePicker from '#/components/pennies/LanguagePicker'
import ThemePicker from '#/components/pennies/ThemePicker'

interface HeaderProps {
  variant: 'mark' | 'title' | 'back'
  title?: string
  onBack?: () => void
  onAccount?: () => void
  userInitials?: string
}

export default function Header({
  variant,
  title,
  onBack,
  onAccount,
  userInitials,
}: HeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="absolute top-0 inset-x-0 h-14 bg-sea-ink text-white flex items-center justify-between px-5 relative z-10">
      {/* Left */}
      <div className="flex items-center">
        {variant === 'mark' && (
          <span className="font-display font-bold text-[20px] leading-none tracking-[-0.01em]">
            {t('appName')}
          </span>
        )}
        {variant === 'title' && (
          <span className="font-bold text-[18px] leading-none">{title}</span>
        )}
        {variant === 'back' && (
          <button
            type="button"
            onClick={onBack}
            className="text-lagoon-mist font-medium text-[14px] bg-transparent border-0 cursor-pointer p-0"
          >
            {t('addExpense.back')}
          </button>
        )}
      </div>

      {/* Center title for back variant */}
      {variant === 'back' && title && (
        <span className="absolute left-1/2 -translate-x-1/2 font-bold text-[16px] leading-none pointer-events-none">
          {title}
        </span>
      )}

      {/* Right */}
      <div className="flex items-center gap-3">
        <ThemePicker variant="header" />
        <LanguagePicker variant="header" />
        {variant === 'mark' && onAccount && (
          <button
            type="button"
            onClick={onAccount}
            aria-label="Account"
            className="w-[30px] h-[30px] rounded-full bg-lagoon text-white font-bold text-[12px] leading-none flex items-center justify-center border-0 cursor-pointer active:scale-95 transition-transform"
          >
            {userInitials || 'A'}
          </button>
        )}
      </div>
    </header>
  )
}
