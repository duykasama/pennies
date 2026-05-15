import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nWrapper } from '#/test/i18n-wrapper'
import MobileTwoFactor from '../TwoFactor'

describe('MobileTwoFactor', () => {
  it('renders exactly 6 numeric inputs', () => {
    render(
      <MobileTwoFactor
        email="user@pennies.app"
        onVerify={vi.fn()}
        onResend={vi.fn()}
        onBack={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    const inputs = document.querySelectorAll('input[inputmode="numeric"]')
    expect(inputs).toHaveLength(6)
  })

  it('each input has maxLength of 1', () => {
    render(
      <MobileTwoFactor
        email="user@pennies.app"
        onVerify={vi.fn()}
        onResend={vi.fn()}
        onBack={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    const inputs = document.querySelectorAll('input[inputmode="numeric"]')
    inputs.forEach((input) => {
      expect((input as HTMLInputElement).maxLength).toBe(1)
    })
  })

  it('typing a digit in box i advances focus to box i+1', () => {
    render(
      <MobileTwoFactor
        email="user@pennies.app"
        onVerify={vi.fn()}
        onResend={vi.fn()}
        onBack={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    const inputs = Array.from(
      document.querySelectorAll('input[inputmode="numeric"]'),
    ) as HTMLInputElement[]

    fireEvent.change(inputs[0], { target: { value: '3' } })
    expect(document.activeElement).toBe(inputs[1])
  })

  it('typing a digit in the last box does not throw or advance past the end', () => {
    render(
      <MobileTwoFactor
        email="user@pennies.app"
        onVerify={vi.fn()}
        onResend={vi.fn()}
        onBack={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    const inputs = Array.from(
      document.querySelectorAll('input[inputmode="numeric"]'),
    ) as HTMLInputElement[]

    expect(() => {
      fireEvent.change(inputs[5], { target: { value: '7' } })
    }).not.toThrow()
  })

  it('pressing Backspace on an empty box i > 0 moves focus to box i-1', () => {
    render(
      <MobileTwoFactor
        email="user@pennies.app"
        onVerify={vi.fn()}
        onResend={vi.fn()}
        onBack={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    const inputs = Array.from(
      document.querySelectorAll('input[inputmode="numeric"]'),
    ) as HTMLInputElement[]

    // Ensure box 2 is empty (default), then fire Backspace on it
    expect(inputs[2].value).toBe('')
    fireEvent.keyDown(inputs[2], { key: 'Backspace' })
    expect(document.activeElement).toBe(inputs[1])
  })

  it('pressing Backspace on box 0 does not move focus', () => {
    render(
      <MobileTwoFactor
        email="user@pennies.app"
        onVerify={vi.fn()}
        onResend={vi.fn()}
        onBack={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    const inputs = Array.from(
      document.querySelectorAll('input[inputmode="numeric"]'),
    ) as HTMLInputElement[]

    inputs[0].focus()
    fireEvent.keyDown(inputs[0], { key: 'Backspace' })
    expect(document.activeElement).toBe(inputs[0])
  })

  it('calls onVerify when Verify button is clicked', () => {
    const onVerify = vi.fn()
    render(
      <MobileTwoFactor
        email="user@pennies.app"
        onVerify={onVerify}
        onResend={vi.fn()}
        onBack={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    fireEvent.click(screen.getByText('Verify'))
    expect(onVerify).toHaveBeenCalledOnce()
  })

  it('calls onResend when Resend is clicked', () => {
    const onResend = vi.fn()
    render(
      <MobileTwoFactor
        email="user@pennies.app"
        onVerify={vi.fn()}
        onResend={onResend}
        onBack={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    fireEvent.click(screen.getByText('Resend'))
    expect(onResend).toHaveBeenCalledOnce()
  })

  it('calls onBack when the Back button is clicked', () => {
    const onBack = vi.fn()
    render(
      <MobileTwoFactor
        email="user@pennies.app"
        onVerify={vi.fn()}
        onResend={vi.fn()}
        onBack={onBack}
      />,
      { wrapper: I18nWrapper },
    )
    fireEvent.click(screen.getByText(/Back/))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('displays the email in the subtitle', () => {
    render(
      <MobileTwoFactor
        email="user@pennies.app"
        onVerify={vi.fn()}
        onResend={vi.fn()}
        onBack={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    expect(screen.getByText(/user@pennies\.app/)).toBeInTheDocument()
  })
})
