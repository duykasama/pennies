import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import i18n from '#/lib/i18n'
import type { ApiCategory } from '#/lib/categories'

export const MOCK_CATEGORIES: ApiCategory[] = [
  { id: 1, name: 'Food & Drink', icon: '🍴' },
  { id: 2, name: 'Transport', icon: '🚌' },
  { id: 3, name: 'Shopping', icon: '🛍' },
  { id: 4, name: 'Entertainment', icon: '🎬' },
  { id: 5, name: 'Health', icon: '❤️' },
  { id: 6, name: 'Utilities', icon: '⚡' },
  { id: 7, name: 'Housing', icon: '🏠' },
  { id: 8, name: 'Other', icon: '···' },
]

export function TestProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  queryClient.setQueryData(['categories', 'en'], MOCK_CATEGORIES)
  queryClient.setQueryData(['categories', 'vi'], MOCK_CATEGORIES)

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nextProvider>
  )
}
