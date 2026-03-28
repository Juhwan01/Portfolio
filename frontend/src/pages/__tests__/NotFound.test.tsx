import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import NotFound from '@pages/NotFound'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('NotFound', () => {
  it('renders 404 heading', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders "Latent Space Not Found" subtitle', () => {
    render(<NotFound />)
    expect(screen.getByText('Latent Space Not Found')).toBeInTheDocument()
  })

  it('renders "Error 404" label', () => {
    render(<NotFound />)
    expect(screen.getByText('Error 404')).toBeInTheDocument()
  })

  it('renders "Return to Origin" link pointing to "/"', () => {
    render(<NotFound />)
    const link = screen.getByRole('link', { name: /return to origin/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders without crashing', () => {
    const { container } = render(<NotFound />)
    expect(container).toBeTruthy()
  })
})
