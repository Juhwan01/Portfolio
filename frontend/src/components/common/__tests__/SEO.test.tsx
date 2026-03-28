import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@/test/test-utils'
import SEO from '../SEO'

describe('SEO', () => {
  it('renders without crashing with no props', () => {
    const { container } = render(<SEO />)
    expect(container).toBeTruthy()
  })

  it('sets default title', async () => {
    render(<SEO />)
    await waitFor(() => {
      expect(document.title).toBe('정주환 | AI Engineer Portfolio')
    })
  })

  it('formats custom title as "Custom | 정주환"', async () => {
    render(<SEO title="Projects" />)
    await waitFor(() => {
      expect(document.title).toBe('Projects | 정주환')
    })
  })

  it('sets meta description', async () => {
    render(<SEO description="Test description" />)
    await waitFor(() => {
      const meta = document.querySelector('meta[name="description"]')
      expect(meta).not.toBeNull()
      expect(meta).toHaveAttribute('content', 'Test description')
    })
  })
})
