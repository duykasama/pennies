import { describe, it, expect } from 'vitest'
import { cn } from '#/lib/utils'

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('ignores falsy values', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar')
  })

  it('handles conditional object syntax', () => {
    expect(cn({ active: true, disabled: false })).toBe('active')
  })

  it('resolves Tailwind conflicts — last class wins', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('returns empty string for no input', () => {
    expect(cn()).toBe('')
  })

  it('handles array syntax', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })
})
