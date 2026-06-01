import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { z } from 'zod'
import { API_URLS } from '#/lib/constants'
import { CATEGORY_FROM_API } from '#/lib/pennies'
import type { Expense } from '#/lib/pennies'

export interface ApiExpense {
  id: string
  title: string
  description: string | null
  amount: number
  category: number
  date: string
}

export function mapApiExpense(r: ApiExpense): Expense {
  return {
    id: r.id,
    cat: CATEGORY_FROM_API[r.category] ?? 'other',
    title: r.title,
    sub: r.description ?? '',
    amount: r.amount,
    date: r.date,
  }
}

export const getExpensesFn = createServerFn().handler(async (): Promise<ApiExpense[]> => {
  const token = getCookie('auth_token')
  const res = await fetch(`${API_URLS.CORE}/expenses`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch expenses')
  return res.json()
})

export const updateExpenseFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      amount: z.number(),
      category: z.number(),
      date: z.string(),
    }),
  )
  .handler(async ({ data }): Promise<ApiExpense> => {
    const { id, ...body } = data
    const token = getCookie('auth_token')
    const res = await fetch(`${API_URLS.CORE}/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Failed to update expense')
    return res.json()
  })

export const deleteExpenseFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const token = getCookie('auth_token')
    const res = await fetch(`${API_URLS.CORE}/expenses/${data.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Failed to delete expense')
  })

export const createExpenseFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      title: z.string(),
      description: z.string().nullable(),
      amount: z.number(),
      category: z.number(),
      date: z.string(),
    }),
  )
  .handler(async ({ data }): Promise<ApiExpense> => {
    const token = getCookie('auth_token')
    const res = await fetch(`${API_URLS.CORE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create expense')
    return res.json()
  })
