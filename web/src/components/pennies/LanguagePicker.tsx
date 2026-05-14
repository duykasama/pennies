import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
]

interface LanguagePickerProps {
  variant: 'topnav' | 'header'
}

export default function LanguagePicker({ variant }: LanguagePickerProps) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isDark = variant === 'topnav' || variant === 'header'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`font-bold text-[12px] leading-none bg-transparent border-0 cursor-pointer p-0 flex items-center gap-0.5 ${isDark ? 'text-lagoon-mist' : 'text-sea-ink-soft'}`}
      >
        {t('nav.language')}
        <span className="text-[9px] ml-0.5">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white rounded-p-md shadow-pop min-w-[144px] overflow-hidden z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                i18n.changeLanguage(lang.code)
                setOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left border-0 bg-transparent hover:bg-foam transition-colors cursor-pointer flex items-center justify-between ${
                lang.code === i18n.language
                  ? 'font-bold text-[13px] text-sea-ink'
                  : 'font-medium text-[13px] text-sea-ink-soft'
              }`}
            >
              <span>{lang.label}</span>
              {lang.code === i18n.language && (
                <span className="text-lagoon font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
