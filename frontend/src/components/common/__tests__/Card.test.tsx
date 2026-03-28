import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import Card from '../Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('has glass class', () => {
    render(<Card>Content</Card>)
    const el = screen.getByText('Content')
    expect(el).toHaveClass('glass')
  })

  it('adds hover class when hover is true (default)', () => {
    render(<Card>Hoverable</Card>)
    const el = screen.getByText('Hoverable').closest('div')!
    expect(el).toHaveClass('hover:bg-white/15')
  })

  it('does not add hover class when hover is false', () => {
    render(<Card hover={false}>Static</Card>)
    const el = screen.getByText('Static').closest('div')!
    expect(el.className).not.toContain('hover:bg-white/15')
  })

  it('applies custom className', () => {
    render(<Card className="my-class">Styled</Card>)
    const el = screen.getByText('Styled').closest('div')!
    expect(el).toHaveClass('my-class')
  })
})
