import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'
import { z } from 'zod'
import { API_URLS } from '#/lib/constants'

export type SessionUser = { sub: string; email: string; displayName: string }

export const getSessionFn = createServerFn().handler(async (): Promise<SessionUser | null> => {
  const token = getCookie('auth_token')
  if (!token) return null
  try {
    const [, b64] = token.split('.')
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString())
    if (payload.exp * 1000 < Date.now()) return null
    return { sub: payload.sub, email: payload.email, displayName: payload.displayName }
  } catch {
    return null
  }
})

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ email: z.string(), password: z.string() }))
  .handler(async ({ data }): Promise<SessionUser> => {
    const res = await fetch(`${API_URLS.AUTH}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: data.password }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error ?? 'Invalid credentials')
    }
    const { accessToken } = await res.json()
    setCookie('auth_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,
      path: '/',
    })
    const [, b64] = accessToken.split('.')
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString())
    return { sub: payload.sub, email: payload.email, displayName: payload.displayName }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  deleteCookie('auth_token')
})

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ displayName: z.string(), email: z.string(), password: z.string() }))
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URLS.AUTH}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body?.error ?? 'Registration failed')
    return body as { id: string; email: string; displayName: string }
  })

export const verifyEmailFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ userId: z.string(), token: z.string() }))
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URLS.AUTH}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body?.error ?? 'Verification failed')
    return body as { message: string }
  })

export const resendConfirmationFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ email: z.string() }))
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URLS.AUTH}/auth/resend-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body?.error ?? 'Failed to resend')
    return body
  })
