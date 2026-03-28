import { describe, it, expect } from 'vitest'
import { createRef } from 'react'
import { render, screen } from '@/test/test-utils'
import { NNButton } from '../NNButton'

describe('NNButton', () => {
  it('renders children', () => {
    render(<NNButton>Click me</NNButton>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('primary variant has bg-gradient-to-r', () => {
    render(<NNButton variant="primary">Primary</NNButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r')
  })

  it('secondary variant has border', () => {
    render(<NNButton variant="secondary">Secondary</NNButton>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('tertiary variant has bg-transparent', () => {
    render(<NNButton variant="tertiary">Tertiary</NNButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<NNButton ref={ref}>Ref test</NNButton>)
    expect(ref.current).not.toBeNull()
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has displayName NNButton', () => {
    expect(NNButton.displayName).toBe('NNButton')
  })
})
