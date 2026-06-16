import { useRouterState } from '@tanstack/react-router'
import type { SessionUser } from '#/lib/auth'

export function useUser(): SessionUser | null {
  return useRouterState({
    select: (s) => {
      const root = s.matches.find((m) => m.routeId === '__root__')
      return (root?.context as { user?: SessionUser } | undefined)?.user ?? null
    },
  })
}
