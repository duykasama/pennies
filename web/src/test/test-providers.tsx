import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import i18n from '#/lib/i18n'
import type { ApiCategory } from '#/lib/categories'
import type { ApiFrequency } from '#/lib/frequencies'

export const MOCK_CATEGORIES: ApiCategory[] = [
  { id: 1, name: 'Food & Drink', icon: '🍴', displayOrder: 1 },
  { id: 2, name: 'Transport', icon: '🚌', displayOrder: 2 },
  { id: 3, name: 'Shopping', icon: '🛍', displayOrder: 3 },
  { id: 4, name: 'Entertainment', icon: '🎬', displayOrder: 4 },
  { id: 5, name: 'Health', icon: '❤️', displayOrder: 5 },
  { id: 6, name: 'Utilities', icon: '⚡', displayOrder: 6 },
  { id: 7, name: 'Housing', icon: '🏠', displayOrder: 7 },
  { id: 8, name: 'Other', icon: '···', displayOrder: 8 },
]

export const MOCK_FREQUENCIES: ApiFrequency[] = [
  { id: 'once', name: 'Once' },
  { id: 'daily', name: 'Daily' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
]

export function TestProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  queryClient.setQueryData(['categories', 'en'], MOCK_CATEGORIES)
  queryClient.setQueryData(['categories', 'vi'], MOCK_CATEGORIES)
  queryClient.setQueryData(['frequencies', 'en'], MOCK_FREQUENCIES)
  queryClient.setQueryData(['frequencies', 'vi'], MOCK_FREQUENCIES)

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nextProvider>
  )
}
