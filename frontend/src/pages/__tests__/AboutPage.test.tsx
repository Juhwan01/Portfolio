import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import AboutPage from '@pages/AboutPage'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...filterMotionProps(props)}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...filterMotionProps(props)}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...filterMotionProps(props)}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...filterMotionProps(props)}>{children}</span>,
    article: ({ children, ...props }: any) => <article {...filterMotionProps(props)}>{children}</article>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

function filterMotionProps(props: Record<string, unknown>) {
  const filtered = { ...props }
  const motionKeys = [
    'initial', 'animate', 'exit', 'variants', 'transition',
    'whileInView', 'viewport', 'whileHover', 'whileTap',
  ]
  for (const key of motionKeys) {
    delete filtered[key]
  }
  return filtered
}

describe('AboutPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<AboutPage />)
    expect(container).toBeTruthy()
  })

  it('contains "Bridging" and "Logic" heading text', () => {
    render(<AboutPage />)
    expect(screen.getByText(/Bridging/)).toBeInTheDocument()
    expect(screen.getByText('Logic')).toBeInTheDocument()
  })

  it('contains career timeline section', () => {
    render(<AboutPage />)
    expect(screen.getByText('Career')).toBeInTheDocument()
    expect(screen.getByText(/Timeline/)).toBeInTheDocument()
  })

  it('contains "Recognition" section', () => {
    render(<AboutPage />)
    expect(screen.getByText('Recognition.')).toBeInTheDocument()
  })

  it('has a link to /contact', () => {
    render(<AboutPage />)
    const contactLink = screen.getByText('Schedule a Consultation')
    expect(contactLink.closest('a')).toHaveAttribute('href', '/contact')
  })
})
