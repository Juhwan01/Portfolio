import { describe, it, expect } from 'vitest'
import { createRef } from 'react'
import { render, screen } from '@/test/test-utils'
import { NNCard } from '../NNCard'

describe('NNCard', () => {
  it('renders children', () => {
    render(<NNCard>Card content</NNCard>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('default elevation low has bg-[#131319]', () => {
    render(<NNCard>Low</NNCard>)
    expect(screen.getByText('Low').closest('div')).toHaveClass('bg-[#131319]')
  })

  it('elevation high has bg-[#1f1f26]', () => {
    render(<NNCard elevation="high">High</NNCard>)
    expect(screen.getByText('High').closest('div')).toHaveClass('bg-[#1f1f26]')
  })

  it('hoverable true adds nn-card-lift', () => {
    render(<NNCard hoverable>Hoverable</NNCard>)
    expect(screen.getByText('Hoverable').closest('div')).toHaveClass('nn-card-lift')
  })

  it('hoverable false does not have nn-card-lift', () => {
    render(<NNCard hoverable={false}>Static</NNCard>)
    const el = screen.getByText('Static').closest('div')!
    expect(el.className).not.toContain('nn-card-lift')
  })

  it('has displayName NNCard', () => {
    expect(NNCard.displayName).toBe('NNCard')
  })
})
