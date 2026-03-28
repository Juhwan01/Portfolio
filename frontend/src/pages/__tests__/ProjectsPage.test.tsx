import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import ProjectsPage from '@pages/ProjectsPage'
import { server } from '@/test/mocks/server'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
  AnimatePresence: ({ children }: any) => children,
  useInView: () => true,
  useAnimation: () => ({ start: vi.fn(), set: vi.fn() }),
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ProjectsPage', () => {
  it('renders the page heading', () => {
    render(<ProjectsPage />)
    expect(screen.getByText(/PROJECT/)).toBeInTheDocument()
  })

  it('loads and displays project titles from API', async () => {
    render(<ProjectsPage />)

    await waitFor(() => {
      expect(screen.getByText('AI ChatBot')).toBeInTheDocument()
    })

    expect(screen.getByText('Portfolio Website')).toBeInTheDocument()
  })

  it('renders filter buttons', () => {
    render(<ProjectsPage />)
    expect(screen.getByText('All Projects')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<ProjectsPage />)
    expect(screen.getByPlaceholderText('QUERY ARCHIVE...')).toBeInTheDocument()
  })
})
