import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders "JUNG JUHWAN"', () => {
    render(<Footer />)
    expect(screen.getByText('JUNG JUHWAN')).toBeInTheDocument()
  })

  it('renders Github link with correct href', () => {
    render(<Footer />)
    const link = screen.getByText('Github')
    expect(link).toHaveAttribute('href', 'https://github.com/Juhwan01')
  })

  it('renders Blog link', () => {
    render(<Footer />)
    expect(screen.getByText('Blog')).toBeInTheDocument()
  })

  it('renders LinkedIn link', () => {
    render(<Footer />)
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
  })

  it('all external links have rel="noopener noreferrer"', () => {
    render(<Footer />)
    const links = [
      screen.getByText('Github'),
      screen.getByText('Blog'),
      screen.getByText('LinkedIn'),
    ]
    for (const link of links) {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
