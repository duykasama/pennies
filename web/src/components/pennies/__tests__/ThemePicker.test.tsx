import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemePicker from '#/components/pennies/ThemePicker'
import { themeStore, setTheme } from '#/lib/themeStore'
import { I18nWrapper } from '#/test/i18n-wrapper'

beforeEach(() => {
  document.documentElement.className = ''
  localStorage.clear()
  themeStore.setState(() => ({ theme: 'system' }))
})

describe('ThemePicker', () => {
  it('dropdown is closed on initial render', () => {
    render(<ThemePicker variant="topnav" />, { wrapper: I18nWrapper })
    expect(screen.queryByText('Light')).not.toBeInTheDocument()
    expect(screen.queryByText('Dark')).not.toBeInTheDocument()
    expect(screen.queryByText('System')).not.toBeInTheDocument()
  })

  it('clicking the toggle opens the dropdown', () => {
    render(<ThemePicker variant="topnav" />, { wrapper: I18nWrapper })
    fireEvent.click(screen.getByRole('button', { name: /theme/i }))
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('clicking outside closes the dropdown', () => {
    render(<ThemePicker variant="topnav" />, { wrapper: I18nWrapper })
    fireEvent.click(screen.getByRole('button', { name: /theme/i }))
    expect(screen.getByText('Dark')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByText('Dark')).not.toBeInTheDocument()
  })

  it('clicking a theme option updates the store', () => {
    render(<ThemePicker variant="topnav" />, { wrapper: I18nWrapper })
    fireEvent.click(screen.getByRole('button', { name: /theme/i }))
    fireEvent.click(screen.getByText('Dark'))
    expect(themeStore.state.theme).toBe('dark')
  })

  it('clicking a theme option closes the dropdown', () => {
    render(<ThemePicker variant="topnav" />, { wrapper: I18nWrapper })
    fireEvent.click(screen.getByRole('button', { name: /theme/i }))
    fireEvent.click(screen.getByText('Light'))
    expect(screen.queryByText('Dark')).not.toBeInTheDocument()
  })

  it('active theme option shows a checkmark', () => {
    setTheme('dark')
    render(<ThemePicker variant="topnav" />, { wrapper: I18nWrapper })
    fireEvent.click(screen.getByRole('button', { name: /theme/i }))
    const darkButton = screen.getByText('Dark').closest('button')!
    expect(darkButton.textContent).toContain('✓')
    const lightButton = screen.getByText('Light').closest('button')!
    expect(lightButton.textContent).not.toContain('✓')
  })
})
