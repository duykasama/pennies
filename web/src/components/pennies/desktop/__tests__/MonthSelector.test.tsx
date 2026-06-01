import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MonthSelector from '#/components/pennies/desktop/MonthSelector'
import i18n from '#/lib/i18n'
import { I18nWrapper } from '#/test/i18n-wrapper'

const MONTHS = ['2026-03', '2026-04', '2026-05']

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

function renderSelector(month: string, onChange = vi.fn()) {
  return render(
    <MonthSelector month={month} months={MONTHS} onChange={onChange} />,
    { wrapper: I18nWrapper },
  )
}

describe('MonthSelector (desktop)', () => {
  it('renders the current month label', () => {
    renderSelector('2026-05')
    expect(screen.getByText('May 2026')).toBeInTheDocument()
  })

  it('prev chevron is disabled on the first month', () => {
    renderSelector('2026-03')
    expect(screen.getByRole('button', { name: /previous month/i })).toBeDisabled()
  })

  it('next chevron is disabled on the last month', () => {
    renderSelector('2026-05')
    expect(screen.getByRole('button', { name: /next month/i })).toBeDisabled()
  })

  it('prev chevron calls onChange with the previous month', () => {
    const onChange = vi.fn()
    renderSelector('2026-05', onChange)
    fireEvent.click(screen.getByRole('button', { name: /previous month/i }))
    expect(onChange).toHaveBeenCalledWith('2026-04')
  })

  it('next chevron calls onChange with the next month', () => {
    const onChange = vi.fn()
    renderSelector('2026-04', onChange)
    fireEvent.click(screen.getByRole('button', { name: /next month/i }))
    expect(onChange).toHaveBeenCalledWith('2026-05')
  })

  it('clicking the label opens the dropdown with all months', () => {
    renderSelector('2026-05')
    fireEvent.click(screen.getByText('May 2026'))
    expect(screen.getByText('March 2026')).toBeInTheDocument()
    expect(screen.getByText('April 2026')).toBeInTheDocument()
  })

  it('selecting a month from the dropdown calls onChange', () => {
    const onChange = vi.fn()
    renderSelector('2026-05', onChange)
    fireEvent.click(screen.getByText('May 2026'))
    fireEvent.click(screen.getByText('March 2026'))
    expect(onChange).toHaveBeenCalledWith('2026-03')
  })

  it('clicking the backdrop overlay closes the dropdown', () => {
    renderSelector('2026-05')
    fireEvent.click(screen.getByText('May 2026'))
    expect(screen.getByText('March 2026')).toBeInTheDocument()
    const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
    fireEvent.click(overlay)
    expect(screen.queryByText('March 2026')).not.toBeInTheDocument()
  })
})
