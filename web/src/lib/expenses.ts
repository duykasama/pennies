import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { z } from 'zod'
import { API_URL } from '#/lib/constants'
import type { ApiCategory } from '#/lib/categories'
import type { ApiFrequency } from '#/lib/frequencies'
import type { Expense } from '#/lib/pennies'

export interface ApiExpense {
  id: string
  title: string
  description: string | null
  amount: number
  category: ApiCategory
  frequency: ApiFrequency | null
  date: string
  updatedAt: string
}

export interface PaginatedExpenses {
  items: ApiExpense[]
  pageIndex: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export function mapApiExpense(r: ApiExpense): Expense {
  return {
    id: r.id,
    cat: r.category.id,
    title: r.title,
    sub: r.description ?? '',
    amount: r.amount,
    date: r.date,
    freq: r.frequency?.id ?? null,
    updatedAt: r.updatedAt,
  }
}

export const getExpensesFn = createServerFn()
  .inputValidator(
    z.object({
      pageIndex: z.number().optional(),
      pageSize: z.number().optional(),
      month: z.number().optional(),
      year: z.number().optional(),
    }),
  )
  .handler(async ({ data }): Promise<PaginatedExpenses> => {
    const token = getCookie('auth_token')
    const params = new URLSearchParams()
    if (data.pageIndex !== undefined)
      params.set('pageIndex', String(data.pageIndex))
    if (data.pageSize !== undefined)
      params.set('pageSize', String(data.pageSize))
    if (data.month !== undefined) params.set('month', String(data.month))
    if (data.year !== undefined) params.set('year', String(data.year))
    const qs = params.toString()
    const res = await fetch(`${API_URL}/expenses${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Failed to fetch expenses')
    return res.json()
  })

export const getExpenseFn = createServerFn()
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<ApiExpense> => {
    const token = getCookie('auth_token')
    const res = await fetch(`${API_URL}/expenses/${data.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Failed to fetch expense')
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
      frequency: z.number().nullable(),
      date: z.string(),
      updatedAt: z.string(),
    }),
  )
  .handler(async ({ data }): Promise<ApiExpense> => {
    const { id, ...body } = data
    const token = getCookie('auth_token')
    const res = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Failed to update expense')
    return res.json()
  })

export const deleteExpenseFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const token = getCookie('auth_token')
    const res = await fetch(`${API_URL}/expenses/${data.id}`, {
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
      frequency: z.number().nullable(),
      date: z.string(),
    }),
  )
  .handler(async ({ data }): Promise<ApiExpense> => {
    const token = getCookie('auth_token')
    const res = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create expense')
    return res.json()
  })
