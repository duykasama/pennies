import i18n from '#/lib/i18n'
import { useEffect } from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import MobileNotFound from '#/components/pennies/mobile/NotFound'
import DesktopNotFound from '#/components/pennies/desktop/NotFound'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import {
  setTheme,
  applyThemeClass,
  themeInitScript,
  themeStore,
} from '#/lib/themeStore'
import type { Theme } from '#/lib/themeStore'
import { getSessionFn } from '#/lib/auth'
import { getLocaleFn, getThemeFn } from '#/lib/locale'
import type { SessionUser } from '#/lib/auth'

interface MyRouterContext {
  queryClient: QueryClient
  user: SessionUser | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Pennies — Daily Expense Tracker' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  beforeLoad: async () => {
    const [user, locale, theme] = await Promise.all([
      getSessionFn(),
      getLocaleFn(),
      getThemeFn(),
    ])
    if (i18n.language !== locale) await i18n.changeLanguage(locale)
    themeStore.setState(() => ({ theme }))
    return { user }
  },
  notFoundComponent: () => (
    <>
      <div className="md:hidden">
        <MobileNotFound />
      </div>
      <div className="hidden md:block">
        <DesktopNotFound />
      </div>
    </>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    const theme =
      saved === 'light' || saved === 'dark' || saved === 'system'
        ? saved
        : 'system'
    setTheme(theme)

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (themeStore.state.theme === 'system') applyThemeClass('system')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
