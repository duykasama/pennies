import { createServerFn } from '@tanstack/react-start'
import {
  getCookie,
  setCookie,
  deleteCookie,
} from '@tanstack/react-start/server'
import { z } from 'zod'
import { API_URL, ROUTES } from '#/lib/constants'

export type SessionUser = { sub: string; email: string; displayName: string }
export type UserProfile = SessionUser

function decodeSessionUser(accessToken: string): SessionUser {
  const [, b64] = accessToken.split('.')
  const payload = JSON.parse(Buffer.from(b64, 'base64url').toString())
  return { sub: payload.sub, email: payload.email, displayName: payload.displayName }
}

function setAuthCookies(accessToken: string, refreshToken: string) {
  const secure = process.env.NODE_ENV === 'production'
  setCookie('auth_token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    maxAge: 60 * 60,
    path: '/',
  })
  setCookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
}

export const getSessionFn = createServerFn().handler(
  async (): Promise<SessionUser | null> => {
    const token = getCookie('auth_token')
    if (token) {
      try {
        const [, b64] = token.split('.')
        const payload = JSON.parse(Buffer.from(b64, 'base64url').toString())
        if (payload.exp * 1000 >= Date.now()) {
          return { sub: payload.sub, email: payload.email, displayName: payload.displayName }
        }
      } catch {
        // fall through to refresh
      }
    }

    const refreshToken = getCookie('refresh_token')
    if (!refreshToken) return null

    try {
      const res = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken, accessToken: token ?? undefined }),
      })
      if (!res.ok) {
        deleteCookie('auth_token')
        deleteCookie('refresh_token')
        return null
      }
      const { accessToken: newAccess, refreshToken: newRefresh } = await res.json()
      setAuthCookies(newAccess, newRefresh)
      return decodeSessionUser(newAccess)
    } catch {
      deleteCookie('auth_token')
      deleteCookie('refresh_token')
      return null
    }
  },
)

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ email: z.string(), password: z.string() }))
  .handler(async ({ data }): Promise<SessionUser> => {
    console.log('url:', `${API_URL}/auth/login`)
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: data.password }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      console.log('error:', res.ok)
      throw new Error(body?.error ?? 'Invalid credentials')
    }
    const { accessToken, refreshToken } = await res.json()
    setAuthCookies(accessToken, refreshToken)
    return decodeSessionUser(accessToken)
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const token = getCookie('auth_token')
  const refreshToken = getCookie('refresh_token')
  if (token && refreshToken) {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {})
  }
  deleteCookie('auth_token')
  deleteCookie('refresh_token')
})

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      displayName: z.string(),
      email: z.string(),
      password: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        confirmationBaseUrl: `${process.env['APP_URL']}${ROUTES.AUTH_VERIFY_EMAIL}`,
      }),
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body?.error ?? 'Registration failed')
    return body as { id: string; email: string; displayName: string }
  })

export const verifyEmailFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body?.error ?? 'Verification failed')
    return body as { message: string }
  })

export const getGoogleAuthUrlFn = createServerFn().handler(
  async (): Promise<string> => {
    const redirectUri = `${process.env['APP_URL']}${ROUTES.AUTH_GOOGLE_CALLBACK}`
    const res = await fetch(
      `${API_URL}/auth/google/url?redirectUri=${encodeURIComponent(redirectUri)}`,
    )
    if (!res.ok) throw new Error('Failed to get Google auth URL')
    const url = await res.json()
    return url
  },
)

export const googleLoginFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ code: z.string() }))
  .handler(async ({ data }): Promise<SessionUser> => {
    const redirectUri = `${process.env['APP_URL']}${ROUTES.AUTH_GOOGLE_CALLBACK}`
    const res = await fetch(`${API_URL}/auth/google/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: data.code, redirectUri }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error ?? 'Google authentication failed')
    }
    const { accessToken, refreshToken } = await res.json()
    setAuthCookies(accessToken, refreshToken)
    return decodeSessionUser(accessToken)
  })

export const resendConfirmationFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ email: z.string() }))
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/auth/resend-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body?.error ?? 'Failed to resend')
    return body
  })

export const getProfileFn = createServerFn().handler(
  async (): Promise<SessionUser> => {
    const token = getCookie('auth_token')
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error ?? 'Failed to load profile')
    }
    return res.json() as Promise<SessionUser>
  },
)

export const updateAccountFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ displayName: z.string().min(1) }))
  .handler(async ({ data }) => {
    const token = getCookie('auth_token')
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/auth/profile/display-name`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error ?? 'Update failed')
    }
  })

export const requestEmailUpdateFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const token = getCookie('auth_token')
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/auth/request-email-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newEmail: data.email }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error ?? 'Request failed')
    }
  })

export const confirmEmailUpdateFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ code: z.string().min(1) }))
  .handler(async ({ data }) => {
    const token = getCookie('auth_token')
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/auth/confirm-email-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error ?? 'Confirmation failed')
    }
  })

export const changePasswordFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({ current: z.string().min(1), next: z.string().min(8) }),
  )
  .handler(async ({ data }) => {
    const token = getCookie('auth_token')
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: data.current,
        newPassword: data.next,
      }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error ?? 'Password change failed')
    }
  })

export const forgotPasswordFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        resetBaseUrl: `${process.env['APP_URL']}${ROUTES.AUTH_RESET_PASSWORD}`,
      }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body?.error ?? 'Request failed')
    return body
  })

export const resetPasswordFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({ token: z.string().min(1), newPassword: z.string().min(8) }),
  )
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body?.error ?? 'Reset failed')
    return body
  })
