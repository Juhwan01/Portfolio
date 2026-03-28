import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import ContactPage from '@pages/ContactPage'
import { submitContactForm } from '@services/api'

vi.mock('@services/api', () => ({
  submitContactForm: vi.fn(),
}))

vi.mock('@components/common/Toast', () => ({
  toast: vi.fn(),
}))

describe('ContactPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form with name, email, and message fields', () => {
    render(<ContactPage />)
    expect(screen.getByPlaceholderText('Janus Case')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('janus@neural.io')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Describe the architectural challenge...')).toBeInTheDocument()
  })

  it('renders submit button with "Deploy Signal" text', () => {
    render(<ContactPage />)
    expect(screen.getByRole('button', { name: /deploy signal/i })).toBeInTheDocument()
  })

  it('submits form successfully', async () => {
    const user = userEvent.setup()
    ;(submitContactForm as any).mockResolvedValue({ message: 'ok' })

    render(<ContactPage />)

    await user.type(screen.getByPlaceholderText('Janus Case'), 'John Doe')
    await user.type(screen.getByPlaceholderText('janus@neural.io'), 'john@example.com')
    await user.type(
      screen.getByPlaceholderText('Describe the architectural challenge...'),
      'Hello, I have a project idea.'
    )

    await user.click(screen.getByRole('button', { name: /deploy signal/i }))

    await waitFor(() => {
      expect(submitContactForm).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        subject: '',
        message: 'Hello, I have a project idea.',
      })
    })
  })

  it('shows "Deploying..." while loading', async () => {
    const user = userEvent.setup()
    ;(submitContactForm as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ message: 'ok' }), 1000))
    )

    render(<ContactPage />)

    await user.type(screen.getByPlaceholderText('Janus Case'), 'John')
    await user.type(screen.getByPlaceholderText('janus@neural.io'), 'j@test.com')
    await user.type(
      screen.getByPlaceholderText('Describe the architectural challenge...'),
      'Test message'
    )

    await user.click(screen.getByRole('button', { name: /deploy signal/i }))

    expect(screen.getByText('Deploying...')).toBeInTheDocument()
  })
})
