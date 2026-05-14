import { describe, it, expect, beforeEach, vi } from 'vitest'
import { themeStore, applyThemeClass, setTheme } from '#/lib/themeStore'

beforeEach(() => {
  document.documentElement.className = ''
  localStorage.clear()
  themeStore.setState(() => ({ theme: 'system' }))
})

describe('applyThemeClass', () => {
  it('adds .dark for theme="dark"', () => {
    applyThemeClass('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes .dark for theme="light"', () => {
    document.documentElement.classList.add('dark')
    applyThemeClass('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('removes .dark for theme="system" when system is light', () => {
    // matchMedia mock returns matches: false (light system)
    document.documentElement.classList.add('dark')
    applyThemeClass('system')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('adds .dark for theme="system" when system is dark', () => {
    window.matchMedia = (query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    applyThemeClass('system')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    // restore default mock
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  })
})

describe('setTheme', () => {
  it('updates themeStore state', () => {
    setTheme('dark')
    expect(themeStore.state.theme).toBe('dark')
  })

  it('persists to localStorage', () => {
    setTheme('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('applies the dark class when set to dark', () => {
    setTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes the dark class when set to light', () => {
    setTheme('dark')
    setTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists each theme value correctly', () => {
    for (const theme of ['light', 'dark', 'system'] as const) {
      setTheme(theme)
      expect(localStorage.getItem('theme')).toBe(theme)
      expect(themeStore.state.theme).toBe(theme)
    }
  })
})
