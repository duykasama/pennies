import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import i18n from '#/lib/i18n'
import { ROUTES } from '#/lib/constants'
import { categoriesQueryOptions } from '#/lib/categories'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: ROUTES.AUTH_SIGN_IN })
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(categoriesQueryOptions(i18n.language)),
  component: () => <Outlet />,
})
