import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { server } from '@/test/mocks/server'
import Skills from '../Skills'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Skills', () => {
  it('shows loading text initially', () => {
    render(<Skills />)
    expect(screen.getByText('Loading skills...')).toBeInTheDocument()
  })

  it('after load, shows "Technical" and "Skills" heading text', async () => {
    render(<Skills />)
    await waitFor(() => {
      expect(screen.getByText('Technical')).toBeInTheDocument()
      expect(screen.getByText('Skills')).toBeInTheDocument()
    })
  })

  it('renders skill names from mock data (e.g., "React", "Python")', async () => {
    render(<Skills />)
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Python')).toBeInTheDocument()
    })
  })

  it('groups skills by category (e.g., "Frontend", "Backend")', async () => {
    render(<Skills />)
    await waitFor(() => {
      expect(screen.getByText('Frontend')).toBeInTheDocument()
      expect(screen.getByText('Backend')).toBeInTheDocument()
    })
  })
})
