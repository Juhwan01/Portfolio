import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import SkillsPage from '@pages/SkillsPage'
import { server } from '@/test/mocks/server'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  },
  AnimatePresence: ({ children }: any) => children,
  useInView: () => true,
  useAnimation: () => ({ start: vi.fn(), set: vi.fn() }),
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('SkillsPage', () => {
  it('renders the page heading', () => {
    render(<SkillsPage />)
    expect(screen.getByText(/Technical/)).toBeInTheDocument()
  })

  it('loads and displays skill names from API', async () => {
    render(<SkillsPage />)

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument()
    })

    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('renders proficiency section', async () => {
    render(<SkillsPage />)

    await waitFor(() => {
      expect(screen.getByText('Core Proficiencies')).toBeInTheDocument()
    })

    expect(screen.getByText('Neural Architectures')).toBeInTheDocument()
  })
})
