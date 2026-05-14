import { describe, it, expect } from 'vitest'
import { formatVnd, CAT_BY_ID, CATEGORIES } from '#/lib/pennies'

describe('formatVnd', () => {
  it('formats a positive amount with ₫ prefix', () => {
    const result = formatVnd(65000)
    expect(result).toMatch(/^₫/)
    expect(result).toContain('65')
    expect(result).not.toContain('-')
  })

  it('formats a negative amount with -₫ prefix', () => {
    const result = formatVnd(-65000)
    expect(result).toMatch(/^-₫/)
    expect(result).toContain('65')
  })

  it('formats zero as ₫0', () => {
    expect(formatVnd(0)).toBe('₫0')
  })

  it('formats large amounts', () => {
    const result = formatVnd(1500000)
    expect(result).toMatch(/^₫/)
    expect(result).toContain('1')
    expect(result).toContain('5')
  })

  it('uses absolute value for negative input', () => {
    const pos = formatVnd(100000)
    const neg = formatVnd(-100000)
    expect(neg).toBe('-' + pos)
  })
})

describe('CAT_BY_ID', () => {
  const EXPECTED_IDS = ['food', 'transport', 'shopping', 'fun', 'health', 'util', 'housing', 'other']

  it('contains all 8 category IDs', () => {
    for (const id of EXPECTED_IDS) {
      expect(CAT_BY_ID[id]).toBeDefined()
    }
  })

  it('has correct shape for every category', () => {
    for (const cat of CATEGORIES) {
      expect(cat).toMatchObject({
        id: expect.any(String),
        label: expect.any(String),
        long: expect.any(String),
        emoji: expect.any(String),
        dot: expect.any(String),
        ink: expect.any(String),
      })
    }
  })

  it('lookup by id returns the matching category', () => {
    expect(CAT_BY_ID['food'].emoji).toBe('🍴')
    expect(CAT_BY_ID['transport'].emoji).toBe('🚌')
    expect(CAT_BY_ID['health'].emoji).toBe('❤️')
  })
})
