import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import type { Theme } from '#/lib/themeStore'

export const getLocaleFn = createServerFn().handler(async (): Promise<string> => {
  return getCookie('locale') ?? 'en'
})

export const getThemeFn = createServerFn().handler(async (): Promise<Theme> => {
  const t = getCookie('theme')
  return t === 'light' || t === 'dark' || t === 'system' ? t : 'system'
})
