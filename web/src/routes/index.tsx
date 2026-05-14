import { createFileRoute, redirect } from '@tanstack/react-router'
import { ROUTES } from '#/lib/constants'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: ROUTES.DASHBOARD })
  },
})
