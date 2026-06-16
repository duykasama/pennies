import { createFileRoute, Outlet } from '@tanstack/react-router'
import { getProfileFn } from '#/lib/auth'

export const Route = createFileRoute('/_authenticated/account')({
  loader: () => getProfileFn(),
  component: () => <Outlet />,
})
