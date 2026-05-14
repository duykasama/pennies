import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LanguagePicker from '#/components/pennies/LanguagePicker'
import i18n from '#/lib/i18n'
import { I18nWrapper } from '#/test/i18n-wrapper'

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

describe('LanguagePicker', () => {
  it('dropdown is closed on initial render', () => {
    render(<LanguagePicker variant="topnav" />, { wrapper: I18nWrapper })
    expect(screen.queryByText('English')).not.toBeInTheDocument()
    expect(screen.queryByText('Tiếng Việt')).not.toBeInTheDocument()
  })

  it('clicking the toggle opens the dropdown', () => {
    render(<LanguagePicker variant="topnav" />, { wrapper: I18nWrapper })
    const [toggle] = screen.getAllByRole('button')
    fireEvent.click(toggle)
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Tiếng Việt')).toBeInTheDocument()
  })

  it('clicking outside closes the dropdown', () => {
    render(<LanguagePicker variant="topnav" />, { wrapper: I18nWrapper })
    const [toggle] = screen.getAllByRole('button')
    fireEvent.click(toggle)
    expect(screen.getByText('English')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByText('English')).not.toBeInTheDocument()
  })

  it('clicking a language closes the dropdown', () => {
    render(<LanguagePicker variant="topnav" />, { wrapper: I18nWrapper })
    const [toggle] = screen.getAllByRole('button')
    fireEvent.click(toggle)
    fireEvent.click(screen.getByText('Tiếng Việt'))
    expect(screen.queryByText('English')).not.toBeInTheDocument()
  })

  it('clicking a language changes i18n language', () => {
    render(<LanguagePicker variant="topnav" />, { wrapper: I18nWrapper })
    const [toggle] = screen.getAllByRole('button')
    fireEvent.click(toggle)
    fireEvent.click(screen.getByText('Tiếng Việt'))
    expect(i18n.language).toBe('vi')
  })

  it('current language shows a checkmark', () => {
    render(<LanguagePicker variant="topnav" />, { wrapper: I18nWrapper })
    const [toggle] = screen.getAllByRole('button')
    fireEvent.click(toggle)
    const enButton = screen.getByText('English').closest('button')!
    expect(enButton.textContent).toContain('✓')
    const viButton = screen.getByText('Tiếng Việt').closest('button')!
    expect(viButton.textContent).not.toContain('✓')
  })
})
