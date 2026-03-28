import { describe, it, expect } from 'vitest'
import { createRef } from 'react'
import { render, screen } from '@/test/test-utils'
import { NNInput, NNTextarea } from '../NNInput'

describe('NNInput', () => {
  it('renders an input element', () => {
    render(<NNInput placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text').tagName).toBe('INPUT')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLInputElement>()
    render(<NNInput ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('has displayName NNInput', () => {
    expect(NNInput.displayName).toBe('NNInput')
  })
})

describe('NNTextarea', () => {
  it('renders a textarea element', () => {
    render(<NNTextarea placeholder="Enter message" />)
    expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter message').tagName).toBe('TEXTAREA')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<NNTextarea ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('has displayName NNTextarea', () => {
    expect(NNTextarea.displayName).toBe('NNTextarea')
  })
})
