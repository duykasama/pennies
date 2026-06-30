import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { API_URL } from '#/lib/constants'

export interface ApiFrequency {
  id: number
  name: string
  displayOrder: number
}

export const getFrequenciesFn = createServerFn()
  .inputValidator(z.object({ lang: z.string().optional() }))
  .handler(async ({ data }): Promise<ApiFrequency[]> => {
    const qs = data.lang ? `?lang=${data.lang}` : ''
    const res = await fetch(`${API_URL}/expenses/frequencies${qs}`)
    if (!res.ok) throw new Error('Failed to fetch frequencies')
    return res.json()
  })

export function frequenciesQueryOptions(lang: string) {
  return {
    queryKey: ['frequencies', lang] as const,
    queryFn: () => getFrequenciesFn({ data: { lang } }),
  }
}
