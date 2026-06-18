import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { API_URL } from '#/lib/constants'

export interface ApiCategory {
  id: number
  name: string
  icon: string
  displayOrder: number
}

export const getCategoriesFn = createServerFn()
  .inputValidator(z.object({ lang: z.string().optional() }))
  .handler(async ({ data }): Promise<ApiCategory[]> => {
    const qs = data.lang ? `?lang=${data.lang}` : ''
    const res = await fetch(`${API_URL}/expenses/categories${qs}`)
    if (!res.ok) throw new Error('Failed to fetch categories')
    const categories: ApiCategory[] = await res.json()
    return categories.sort((a, b) => a.displayOrder - b.displayOrder)
  })

export function categoriesQueryOptions(lang: string) {
  return {
    queryKey: ['categories', lang] as const,
    queryFn: () => getCategoriesFn({ data: { lang } }),
  }
}

// Colors aren't part of the API response — assign deterministically from a
// static 8-color palette (presentation-only, mirrors the old --cat-* vars).
const PALETTE: { dot: string; ink: string }[] = [
  { dot: 'var(--cat-food)', ink: 'var(--cat-food-ink)' },
  { dot: 'var(--cat-transport)', ink: 'var(--cat-transport-ink)' },
  { dot: 'var(--cat-shopping)', ink: 'var(--cat-shopping-ink)' },
  { dot: 'var(--cat-entertain)', ink: 'var(--cat-entertain-ink)' },
  { dot: 'var(--cat-health)', ink: 'var(--cat-health-ink)' },
  { dot: 'var(--cat-utilities)', ink: 'var(--cat-utilities-ink)' },
  { dot: 'var(--cat-housing)', ink: 'var(--cat-housing-ink)' },
  { dot: 'var(--cat-other)', ink: 'var(--cat-other-ink)' },
]

export function categoryColor(id: number): { dot: string; ink: string } {
  const idx = ((id - 1) % PALETTE.length + PALETTE.length) % PALETTE.length
  return PALETTE[idx]
}
