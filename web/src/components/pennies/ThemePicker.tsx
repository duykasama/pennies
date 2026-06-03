import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme, setTheme } from '#/lib/themeStore'
import type { Theme } from '#/lib/themeStore'

const THEMES: { value: Theme; icon: React.ElementType; labelKey: 'theme.light' | 'theme.dark' | 'theme.system' }[] = [
  { value: 'light', icon: Sun, labelKey: 'theme.light' },
  { value: 'dark', icon: Moon, labelKey: 'theme.dark' },
  { value: 'system', icon: Monitor, labelKey: 'theme.system' },
]

interface ThemePickerProps {
  variant: 'topnav' | 'header'
}

export default function ThemePicker({ variant }: ThemePickerProps) {
  const { t } = useTranslation()
  const theme = useTheme()
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

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[2]
  const CurrentIcon = current.icon
  const isDark = variant === 'topnav' || variant === 'header'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`bg-transparent border-0 cursor-pointer p-0 flex items-center gap-0.5 ${isDark ? 'text-lagoon-mist' : 'text-sea-ink-soft'}`}
        aria-label={t('theme.label')}
      >
        <CurrentIcon size={14} strokeWidth={2.5} />
        <span className="text-[9px] ml-0.5">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white rounded-p-md shadow-pop min-w-[144px] overflow-hidden z-50">
          {THEMES.map(({ value, icon: Icon, labelKey }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTheme(value)
                setOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left border-0 bg-transparent hover:bg-foam transition-colors cursor-pointer flex items-center gap-2.5 ${
                value === theme
                  ? 'font-bold text-[13px] text-sea-ink'
                  : 'font-medium text-[13px] text-sea-ink-soft'
              }`}
            >
              <Icon size={13} strokeWidth={2} />
              <span className="flex-1">{t(labelKey)}</span>
              {value === theme && <span className="text-lagoon font-bold">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
