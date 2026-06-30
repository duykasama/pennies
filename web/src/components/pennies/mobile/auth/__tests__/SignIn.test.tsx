import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nWrapper } from '#/test/i18n-wrapper'
import MobileSignIn from '../SignIn'

describe('MobileSignIn', () => {
  it('renders the welcome back heading', () => {
    render(
      <MobileSignIn
        onSubmit={vi.fn()}
        onGoogle={vi.fn()}
        onSignUp={vi.fn()}
        onForgot={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
  })

  it('renders email and password inputs', () => {
    render(
      <MobileSignIn
        onSubmit={vi.fn()}
        onGoogle={vi.fn()}
        onSignUp={vi.fn()}
        onForgot={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('calls onForgot when the Forgot? button is clicked', () => {
    const onForgot = vi.fn()
    render(
      <MobileSignIn
        onSubmit={vi.fn()}
        onGoogle={vi.fn()}
        onSignUp={vi.fn()}
        onForgot={onForgot}
      />,
      { wrapper: I18nWrapper },
    )
    fireEvent.click(screen.getByText('Forgot?'))
    expect(onForgot).toHaveBeenCalledOnce()
  })

  it('calls onSubmit with the current email value when Sign in is clicked', () => {
    const onSubmit = vi.fn()
    render(
      <MobileSignIn
        onSubmit={onSubmit}
        onGoogle={vi.fn()}
        onSignUp={vi.fn()}
        onForgot={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'user@pennies.app' },
    })
    fireEvent.click(screen.getByText('Sign in'))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith('user@pennies.app', '')
  })

  it('calls onSubmit with empty string when email is untouched', () => {
    const onSubmit = vi.fn()
    render(
      <MobileSignIn
        onSubmit={onSubmit}
        onGoogle={vi.fn()}
        onSignUp={vi.fn()}
        onForgot={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    fireEvent.click(screen.getByText('Sign in'))
    expect(onSubmit).toHaveBeenCalledWith('', '')
  })

  it('calls onGoogle when the Google button is clicked', () => {
    const onGoogle = vi.fn()
    render(
      <MobileSignIn
        onSubmit={vi.fn()}
        onGoogle={onGoogle}
        onSignUp={vi.fn()}
        onForgot={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    fireEvent.click(screen.getByText('Sign in with Google'))
    expect(onGoogle).toHaveBeenCalledOnce()
  })

  it('calls onSignUp when the Create account link is clicked', () => {
    const onSignUp = vi.fn()
    render(
      <MobileSignIn
        onSubmit={vi.fn()}
        onGoogle={vi.fn()}
        onSignUp={onSignUp}
        onForgot={vi.fn()}
      />,
      { wrapper: I18nWrapper },
    )
    fireEvent.click(screen.getByText('Create account'))
    expect(onSignUp).toHaveBeenCalledOnce()
  })
})
