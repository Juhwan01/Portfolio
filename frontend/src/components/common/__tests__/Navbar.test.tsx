import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import Navbar from '../Navbar'

describe('Navbar', () => {
  it('renders logo "Jung Juhwan"', () => {
    render(<Navbar />)
    expect(screen.getByText('Jung Juhwan')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<Navbar />)
    const expectedLinks = ['Home', 'About', 'Projects', 'Skills', 'Blog', 'Contact']
    for (const label of expectedLinks) {
      expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('has mobile menu button with correct aria-label', () => {
    render(<Navbar />)
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument()
  })

  it('clicking mobile menu button shows mobile nav links', async () => {
    const user = userEvent.setup()
    render(<Navbar />)
    await user.click(screen.getByLabelText('Toggle menu'))
    const homeLinks = screen.getAllByText('Home')
    expect(homeLinks.length).toBeGreaterThanOrEqual(2)
  })
})
