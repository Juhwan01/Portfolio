import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { NNBadge } from '../NNBadge'

describe('NNBadge', () => {
  it('renders children text', () => {
    render(<NNBadge>Badge text</NNBadge>)
    expect(screen.getByText('Badge text')).toBeInTheDocument()
  })

  it('default variant has text-[#acaab1]', () => {
    render(<NNBadge>Default</NNBadge>)
    expect(screen.getByText('Default').closest('span')).toHaveClass('text-[#acaab1]')
  })

  it('accent variant has text-[#a8a4ff]', () => {
    render(<NNBadge variant="accent">Accent</NNBadge>)
    expect(screen.getByText('Accent').closest('span')).toHaveClass('text-[#a8a4ff]')
  })

  it('live variant shows pulse dot', () => {
    const { container } = render(<NNBadge variant="live">Live</NNBadge>)
    const pulseDot = container.querySelector('.bg-\\[\\#ff9dcf\\]')
    expect(pulseDot).toBeInTheDocument()
  })

  it('non-live variants do not show pulse dot', () => {
    const { container: defaultContainer } = render(<NNBadge>Default</NNBadge>)
    expect(defaultContainer.querySelector('.bg-\\[\\#ff9dcf\\]')).not.toBeInTheDocument()

    const { container: accentContainer } = render(<NNBadge variant="accent">Accent</NNBadge>)
    expect(accentContainer.querySelector('.bg-\\[\\#ff9dcf\\]')).not.toBeInTheDocument()
  })
})
