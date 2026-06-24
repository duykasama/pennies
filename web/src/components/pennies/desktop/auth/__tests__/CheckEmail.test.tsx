import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nWrapper } from '#/test/i18n-wrapper'
import DesktopCheckEmail from '../CheckEmail'

describe('DesktopCheckEmail', () => {
  it('renders the check email heading', () => {
    render(
      <DesktopCheckEmail
        email="test@example.com"
        onResend={vi.fn()}
        onUseDifferent={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    expect(screen.getByText('Check your email')).toBeInTheDocument()
  })

  it('displays the provided email address', () => {
    render(
      <DesktopCheckEmail
        email="user@pennies.app"
        onResend={vi.fn()}
        onUseDifferent={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    expect(screen.getByText('user@pennies.app')).toBeInTheDocument()
  })

  it('calls onResend when the resend button is clicked', () => {
    const onResend = vi.fn()
    render(
      <DesktopCheckEmail
        email="test@example.com"
        onResend={onResend}
        onUseDifferent={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    fireEvent.click(screen.getByText("Didn't get it? Resend"))
    expect(onResend).toHaveBeenCalledOnce()
  })

  it('calls onUseDifferent when the use different email button is clicked', () => {
    const onUseDifferent = vi.fn()
    render(
      <DesktopCheckEmail
        email="test@example.com"
        onResend={vi.fn()}
        onUseDifferent={onUseDifferent}
      />,
      { wrapper: I18nWrapper },
    )
    fireEvent.click(screen.getByText('Use a different email'))
    expect(onUseDifferent).toHaveBeenCalledOnce()
  })
})
