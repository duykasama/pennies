import { describe, it, expect } from 'vitest'
import en from '#/lib/locales/en'
import vi from '#/lib/locales/vi'

function getLeafKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return getLeafKeys(value as Record<string, unknown>, fullKey)
    }
    return [fullKey]
  })
}

describe('locales', () => {
  const enKeys = getLeafKeys(en as unknown as Record<string, unknown>)
  const viKeys = getLeafKeys(vi as unknown as Record<string, unknown>)

  it('Vietnamese locale has every key that English has', () => {
    const missing = enKeys.filter((k) => !viKeys.includes(k))
    expect(missing).toEqual([])
  })

  it('English locale has every key that Vietnamese has', () => {
    const extra = viKeys.filter((k) => !enKeys.includes(k))
    expect(extra).toEqual([])
  })

  it('no English value is an empty string', () => {
    function checkNoEmpty(obj: Record<string, unknown>, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key
        if (typeof value === 'object' && value !== null) {
          checkNoEmpty(value as Record<string, unknown>, fullPath)
        } else {
          expect(value, `en.${fullPath} should not be empty`).not.toBe('')
        }
      }
    }
    checkNoEmpty(en as unknown as Record<string, unknown>)
  })

  it('no Vietnamese value is an empty string', () => {
    function checkNoEmpty(obj: Record<string, unknown>, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key
        if (typeof value === 'object' && value !== null) {
          checkNoEmpty(value as Record<string, unknown>, fullPath)
        } else {
          expect(value, `vi.${fullPath} should not be empty`).not.toBe('')
        }
      }
    }
    checkNoEmpty(vi as unknown as Record<string, unknown>)
  })
})
