import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EditExpense from '#/components/pennies/desktop/EditExpense'
import type { Expense } from '#/lib/pennies'
import i18n from '#/lib/i18n'
import { TestProviders } from '#/test/test-providers'

const BASE_EXPENSE: Expense = {
  id: 'e3',
  cat: 3,
  title: 'Shopping',
  sub: 'Bookstore',
  amount: -320000,
  date: '2026-05-13',
  updatedAt: '',
}

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

function renderEdit(overrides?: {
  onClose?: () => void
  onUpdate?: (exp: Expense) => void
  onDelete?: (id: string) => void
}) {
  const props = {
    expense: BASE_EXPENSE,
    onClose: vi.fn(),
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
    ...overrides,
  }
  render(<EditExpense {...props} />, { wrapper: TestProviders })
  return props
}

describe('EditExpense (desktop)', () => {
  it('renders pre-filled amount', () => {
    renderEdit()
    const input = screen.getByPlaceholderText('0') as HTMLInputElement
    expect(input.value).toBe('320000')
  })

  it('renders pre-filled description', () => {
    renderEdit()
    expect(screen.getByDisplayValue('Shopping')).toBeInTheDocument()
  })

  it('renders Cancel, Delete and Update buttons', () => {
    renderEdit()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
  })

  it('Cancel button calls onClose', () => {
    const { onClose } = renderEdit()
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('close (✕) button calls onClose', () => {
    const { onClose } = renderEdit()
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('Delete button calls onDelete with the expense id', () => {
    const { onDelete } = renderEdit()
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith('e3')
  })

  it('Update with a blank amount shows a validation error and does not call onUpdate', () => {
    const { onUpdate } = renderEdit()
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: /update/i }))
    expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('Update with a blank description shows a validation error and does not call onUpdate', () => {
    const { onUpdate } = renderEdit()
    const descInput = screen.getByDisplayValue('Shopping')
    fireEvent.change(descInput, { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: /update/i }))
    expect(screen.getByText(/add a short description/i)).toBeInTheDocument()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('Update with valid data calls onUpdate with the correct negative amount', () => {
    const { onUpdate } = renderEdit()
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '500000' } })
    fireEvent.change(screen.getByDisplayValue('Shopping'), { target: { value: 'Coffee' } })
    fireEvent.click(screen.getByRole('button', { name: /update/i }))
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ amount: -500000, title: 'Coffee', sub: 'Bookstore' }))
  })
})
