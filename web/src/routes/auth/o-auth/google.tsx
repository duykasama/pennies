import { createFileRoute, redirect } from '@tanstack/react-router'
import { googleLoginFn } from '#/lib/auth'
import { ROUTES } from '#/lib/constants'

export const Route = createFileRoute('/auth/o-auth/google')({
  validateSearch: (search) => ({
    code: typeof search.code === 'string' ? search.code : '',
  }),
  beforeLoad: async ({ search }) => {
    if (!search.code) throw redirect({ to: ROUTES.AUTH_SIGN_IN })
    try {
      await googleLoginFn({ data: { code: search.code } })
    } catch {
      throw redirect({ to: ROUTES.AUTH_SIGN_IN })
    }
    throw redirect({ to: ROUTES.DASHBOARD })
  },
  component: () => null,
})
