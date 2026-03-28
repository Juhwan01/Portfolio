import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import BlogPage from '@pages/BlogPage'
import { server } from '@/test/mocks/server'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => children,
  useInView: () => true,
  useAnimation: () => ({ start: vi.fn(), set: vi.fn() }),
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('BlogPage', () => {
  it('renders the page heading', () => {
    render(<BlogPage />)
    expect(screen.getByText(/Neural Log/)).toBeInTheDocument()
  })

  it('loads and displays blog post titles from API', async () => {
    render(<BlogPage />)

    await waitFor(() => {
      expect(screen.getByText('Understanding Transformers')).toBeInTheDocument()
    })
  })

  it('renders category filter buttons', () => {
    render(<BlogPage />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('AI/ML')).toBeInTheDocument()
    expect(screen.getByText('Tutorial')).toBeInTheDocument()
  })
})
