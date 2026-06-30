import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { frequenciesQueryOptions } from '#/lib/frequencies'
import type { ApiFrequency } from '#/lib/frequencies'

export function useFrequencies(): ApiFrequency[] {
  const { i18n } = useTranslation()
  return useSuspenseQuery(frequenciesQueryOptions(i18n.language)).data
}
