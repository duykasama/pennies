import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nWrapper } from '#/test/i18n-wrapper'
import DesktopSignUp from '../SignUp'

describe('DesktopSignUp', () => {
  it('renders the create account heading', () => {
    render(
      <DesktopSignUp
        onSubmit={vi.fn()}
        onGoogle={vi.fn()}
        onSignIn={vi.fn()}
      />,
      {
        wrapper: I18nWrapper,
      },
    )
    expect(screen.getByText('Create your account')).toBeInTheDocument()
  })

  it('renders full name, email, and password inputs', () => {
    render(
      <DesktopSignUp
        onSubmit={vi.fn()}
        onGoogle={vi.fn()}
        onSignIn={vi.fn()}
      />,
      {
        wrapper: I18nWrapper,
      },
    )
    expect(screen.getByPlaceholderText('Alex Nguyen')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('At least 8 characters'),
    ).toBeInTheDocument()
  })

  it('calls onSubmit with name and email when Create account is clicked', () => {
    const onSubmit = vi.fn()
    render(
      <DesktopSignUp
        onSubmit={onSubmit}
        onGoogle={vi.fn()}
        onSignIn={vi.fn()}
      />,
      {
        wrapper: I18nWrapper,
      },
    )

    fireEvent.change(screen.getByPlaceholderText('Alex Nguyen'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'jane@example.com' },
    })
    fireEvent.click(screen.getByText('Create account'))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith('Jane Doe', 'jane@example.com')
  })

  it('calls onSubmit with empty strings when fields are untouched', () => {
    const onSubmit = vi.fn()
    render(
      <DesktopSignUp
        onSubmit={onSubmit}
        onGoogle={vi.fn()}
        onSignIn={vi.fn()}
      />,
      {
        wrapper: I18nWrapper,
      },
    )
    fireEvent.click(screen.getByText('Create account'))
    expect(onSubmit).toHaveBeenCalledWith('', '')
  })

  it('calls onGoogle when the Google button is clicked', () => {
    const onGoogle = vi.fn()
    render(
      <DesktopSignUp
        onSubmit={vi.fn()}
        onGoogle={onGoogle}
        onSignIn={vi.fn()}
      />,
      {
        wrapper: I18nWrapper,
      },
    )
    fireEvent.click(screen.getByText('Sign up with Google'))
    expect(onGoogle).toHaveBeenCalledOnce()
  })

  it('calls onSignIn when the sign-in link is clicked', () => {
    const onSignIn = vi.fn()
    render(
      <DesktopSignUp
        onSubmit={vi.fn()}
        onGoogle={vi.fn()}
        onSignIn={onSignIn}
      />,
      {
        wrapper: I18nWrapper,
      },
    )
    fireEvent.click(screen.getByText('Sign in'))
    expect(onSignIn).toHaveBeenCalledOnce()
  })
})
