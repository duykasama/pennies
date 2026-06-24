import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/react-store'

export type Theme = 'light' | 'dark' | 'system'

export const themeStore = new Store<{ theme: Theme }>({ theme: 'system' })

export function applyThemeClass(theme: Theme) {
  if (typeof window === 'undefined') return
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

export function setTheme(theme: Theme) {
  themeStore.setState(() => ({ theme }))
  if (typeof window === 'undefined') return
  localStorage.setItem('theme', theme)
  document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
  applyThemeClass(theme)
}

export function useTheme() {
  return useStore(themeStore, (s) => s.theme)
}

// Inline script string injected into <head> to prevent flash-of-wrong-theme.
// Runs synchronously before React hydrates.
export const themeInitScript = `(function(){var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');})()`
