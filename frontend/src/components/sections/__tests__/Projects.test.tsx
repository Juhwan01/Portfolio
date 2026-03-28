import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { server } from '@/test/mocks/server'
import Projects from '../Projects'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Projects', () => {
  it('shows loading text initially', () => {
    render(<Projects />)
    expect(screen.getByText('Loading projects...')).toBeInTheDocument()
  })

  it('after load, shows "Featured" and "Projects" heading text', async () => {
    render(<Projects />)
    await waitFor(() => {
      expect(screen.getByText('Featured')).toBeInTheDocument()
      expect(screen.getByText('Projects')).toBeInTheDocument()
    })
  })

  it('renders project titles from mock data', async () => {
    render(<Projects />)
    await waitFor(() => {
      expect(screen.getByText('AI ChatBot')).toBeInTheDocument()
      expect(screen.getByText('Portfolio Website')).toBeInTheDocument()
    })
  })
})
