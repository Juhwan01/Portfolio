import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import Login from '@pages/admin/Login'
import { login } from '@services/api'
import { useAuthStore } from '@stores/authStore'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@services/api', () => ({
  login: vi.fn().mockResolvedValue({ accessToken: 'mock-token' }),
  register: vi.fn().mockResolvedValue({ accessToken: 'mock-token' }),
}))

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.getState().logout()
  })

  it('renders login form with username and password inputs', () => {
    render(<Login />)
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders "Sign In" button', () => {
    render(<Login />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('toggles to register mode and shows "Create Account" button', async () => {
    const user = userEvent.setup()
    render(<Login />)

    const toggleButton = screen.getByText(/first time\? create admin account/i)
    await user.click(toggleButton)

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('submits login form and navigates to /admin', async () => {
    const user = userEvent.setup()
    render(<Login />)

    await user.type(screen.getByLabelText(/username/i), 'admin')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        username: 'admin',
        password: 'password123',
      })
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })
  })
})
