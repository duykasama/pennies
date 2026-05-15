import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nWrapper } from '#/test/i18n-wrapper'
import DesktopRegSuccess from '../RegSuccess'

describe('DesktopRegSuccess', () => {
  it('renders the verified heading', () => {
    render(<DesktopRegSuccess onContinue={vi.fn()} />, { wrapper: I18nWrapper })
    expect(screen.getByText("You're all set")).toBeInTheDocument()
  })

  it('renders the Go to Pennies button', () => {
    render(<DesktopRegSuccess onContinue={vi.fn()} />, { wrapper: I18nWrapper })
    expect(screen.getByText('Go to Pennies →')).toBeInTheDocument()
  })

  it('calls onContinue when Go to Pennies is clicked', () => {
    const onContinue = vi.fn()
    render(<DesktopRegSuccess onContinue={onContinue} />, { wrapper: I18nWrapper })
    fireEvent.click(screen.getByText('Go to Pennies →'))
    expect(onContinue).toHaveBeenCalledOnce()
  })

  it('shows the default email when no email prop is provided', () => {
    render(<DesktopRegSuccess onContinue={vi.fn()} />, { wrapper: I18nWrapper })
    expect(screen.getByText(/alex@example\.com/)).toBeInTheDocument()
  })

  it('shows the provided email in the footer', () => {
    render(<DesktopRegSuccess email="jane@pennies.app" onContinue={vi.fn()} />, {
      wrapper: I18nWrapper,
    })
    expect(screen.getByText(/jane@pennies\.app/)).toBeInTheDocument()
  })
})
