import { useEffect, useState } from 'react'

const COOLDOWN = 30
const TRIGGER_KEY = 'pennies:cooldown_trigger'

function storageKey(email: string) {
  return `pennies:resend_cooldown:${email}`
}

export function useResendCooldown({ email = '' } = {}) {
  const key = storageKey(email)

  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    // Always consume the flag on mount so it never outlives a single navigation
    const triggered = sessionStorage.getItem(TRIGGER_KEY) === '1'
    if (triggered) sessionStorage.removeItem(TRIGGER_KEY)

    setStartedAt(null)
    setSecondsLeft(0)

    const ts = localStorage.getItem(key)
    if (ts) {
      const elapsed = Date.now() - Number(ts)
      if (elapsed < COOLDOWN * 1000) {
        const at = Number(ts)
        setStartedAt(at)
        setSecondsLeft(Math.max(0, COOLDOWN - Math.floor(elapsed / 1000)))
        return
      }
    }

    if (triggered) {
      const now = Date.now()
      localStorage.setItem(key, String(now))
      setStartedAt(now)
      setSecondsLeft(COOLDOWN)
    }
  }, [key])

  useEffect(() => {
    if (!startedAt) return
    const id = setInterval(() => {
      const left = Math.max(0, COOLDOWN - Math.floor((Date.now() - startedAt) / 1000))
      setSecondsLeft(left)
      if (left === 0) {
        setStartedAt(null)
        localStorage.removeItem(key)
      }
    }, 500)
    return () => clearInterval(id)
  }, [startedAt, key])

  function startCooldown() {
    const now = Date.now()
    localStorage.setItem(key, String(now))
    setStartedAt(now)
    setSecondsLeft(COOLDOWN)
  }

  return { secondsLeft, startCooldown }
}
