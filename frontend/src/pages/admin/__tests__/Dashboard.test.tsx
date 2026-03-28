import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { server } from '@/test/mocks/server'
import Dashboard from '../Dashboard'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Dashboard', () => {
  it('shows loading text initially', () => {
    render(<Dashboard />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('after load, shows "Dashboard" heading', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  it('shows stat labels (Total Projects, Featured)', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Total Projects')).toBeInTheDocument()
      const featuredElements = screen.getAllByText('Featured')
      expect(featuredElements.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows "Manage Projects" link', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Manage Projects')).toBeInTheDocument()
    })
  })

  it('shows project titles in table', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('AI ChatBot')).toBeInTheDocument()
      expect(screen.getByText('Portfolio Website')).toBeInTheDocument()
    })
  })
})
