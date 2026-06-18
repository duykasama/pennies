import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { categoriesQueryOptions } from '#/lib/categories'
import type { ApiCategory } from '#/lib/categories'

export function useCategories(): ApiCategory[] {
  const { i18n } = useTranslation()
  return useSuspenseQuery(categoriesQueryOptions(i18n.language)).data
}
