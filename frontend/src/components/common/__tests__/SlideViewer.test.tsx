import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import SlideViewer from '../SlideViewer'

describe('SlideViewer', () => {
  it('returns null when url is empty string', () => {
    const { container } = render(<SlideViewer url="" />)
    expect(container.innerHTML).toBe('')
  })

  it('renders title text', () => {
    render(<SlideViewer url="https://example.com/embed" title="My Slides" />)
    expect(screen.getByText('My Slides')).toBeInTheDocument()
  })

  it('renders iframe with embed URL', () => {
    render(<SlideViewer url="https://example.com/embed" title="Test" />)
    const iframe = document.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe!.src).toBe('https://example.com/embed')
  })

  it('converts Google Slides share URL to embed URL (iframe src contains /embed)', () => {
    render(
      <SlideViewer
        url="https://docs.google.com/presentation/d/ABC123/edit?usp=sharing"
        title="Test"
      />
    )
    const iframe = document.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe!.src).toContain('/embed')
    expect(iframe!.src).toContain('ABC123')
  })

  it('keeps already-embed URLs as-is', () => {
    const embedUrl = 'https://docs.google.com/presentation/d/XYZ789/embed?start=false'
    render(<SlideViewer url={embedUrl} title="Test" />)
    const iframe = document.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe!.src).toBe(embedUrl)
  })
})
