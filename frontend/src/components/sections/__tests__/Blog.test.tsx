import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { server } from '@/test/mocks/server'
import Blog from '../Blog'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Blog', () => {
  it('shows loading text initially', () => {
    render(<Blog />)
    expect(screen.getByText('Loading blog posts...')).toBeInTheDocument()
  })

  it('after load, shows "Latest" and "Articles" heading text', async () => {
    render(<Blog />)
    await waitFor(() => {
      expect(screen.getByText('Latest')).toBeInTheDocument()
      expect(screen.getByText('Articles')).toBeInTheDocument()
    })
  })

  it('renders blog post titles from mock data', async () => {
    render(<Blog />)
    await waitFor(() => {
      expect(screen.getByText('Understanding Transformers')).toBeInTheDocument()
      expect(screen.getByText('React Performance Tips')).toBeInTheDocument()
    })
  })

  it('each post links to /blog/:id', async () => {
    render(<Blog />)
    await waitFor(() => {
      expect(screen.getByText('Understanding Transformers')).toBeInTheDocument()
    })
    const links = screen.getAllByRole('link')
    expect(links.some((link) => link.getAttribute('href') === '/blog/test-blog-1')).toBe(true)
    expect(links.some((link) => link.getAttribute('href') === '/blog/test-blog-2')).toBe(true)
  })
})
