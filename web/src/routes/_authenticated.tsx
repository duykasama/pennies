import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ROUTES } from '#/lib/constants'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: ROUTES.AUTH_SIGN_IN })
  },
  component: () => <Outlet />,
})
