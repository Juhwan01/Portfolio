import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import ErrorBoundary from '../ErrorBoundary'

function ThrowError() {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Safe content')).toBeInTheDocument()
  })

  it('shows error UI when child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(screen.getByText('Oops')).toBeInTheDocument()
    spy.mockRestore()
  })

  it('error UI contains "Oops" text', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Oops')
    spy.mockRestore()
  })

  it('error UI contains reload button', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(screen.getByRole('button', { name: '새로고침' })).toBeInTheDocument()
    spy.mockRestore()
  })

  it('clicking reload button calls window.location.reload', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadMock },
      writable: true,
    })

    const user = userEvent.setup()
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    await user.click(screen.getByRole('button', { name: '새로고침' }))
    expect(reloadMock).toHaveBeenCalled()
    spy.mockRestore()
  })
})
