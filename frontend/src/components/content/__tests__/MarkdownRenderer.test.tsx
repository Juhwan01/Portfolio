import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import MarkdownRenderer from '@components/content/MarkdownRenderer'

describe('MarkdownRenderer', () => {
  it('renders h1 headings', () => {
    render(<MarkdownRenderer content="# Heading 1" />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Heading 1')
  })

  it('renders h2 headings', () => {
    render(<MarkdownRenderer content="## Heading 2" />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Heading 2')
  })

  it('renders h3 headings', () => {
    render(<MarkdownRenderer content="### Heading 3" />)
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent('Heading 3')
  })

  it('renders paragraphs', () => {
    render(<MarkdownRenderer content="This is a paragraph." />)
    expect(screen.getByText('This is a paragraph.')).toBeInTheDocument()
  })

  it('renders links with target="_blank" and rel="noopener noreferrer"', () => {
    render(<MarkdownRenderer content="[Example](https://example.com)" />)
    const link = screen.getByRole('link', { name: 'Example' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders unordered lists', () => {
    const md = ['- Item A', '- Item B', '- Item C'].join('\n')
    render(<MarkdownRenderer content={md} />)
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Item B')).toBeInTheDocument()
    expect(screen.getByText('Item C')).toBeInTheDocument()
  })

  it('renders ordered lists', () => {
    const md = ['1. First', '2. Second', '3. Third'].join('\n')
    render(<MarkdownRenderer content={md} />)
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('renders blockquotes', () => {
    render(<MarkdownRenderer content="> This is a quote" />)
    const blockquote = screen.getByRole('blockquote')
    expect(blockquote).toBeInTheDocument()
    expect(blockquote).toHaveTextContent('This is a quote')
  })

  it('renders inline code', () => {
    render(<MarkdownRenderer content="Use `console.log` for debugging" />)
    const code = screen.getByText('console.log')
    expect(code.tagName).toBe('CODE')
  })

  it('renders code blocks', () => {
    render(<MarkdownRenderer content={'```\nconst x = 1\n```'} />)
    expect(screen.getByText('const x = 1')).toBeInTheDocument()
  })

  it('renders images with loading="lazy"', () => {
    render(<MarkdownRenderer content="![Alt text](https://example.com/img.png)" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('src', 'https://example.com/img.png')
    expect(img).toHaveAttribute('alt', 'Alt text')
  })

  it('renders horizontal rules', () => {
    const md = ['Above', '', '---', '', 'Below'].join('\n')
    const { container } = render(<MarkdownRenderer content={md} />)
    const hr = container.querySelector('hr')
    expect(hr).toBeInTheDocument()
  })

  it('renders tables', () => {
    const md = '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |'
    render(<MarkdownRenderer content={md} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Header 1')).toBeInTheDocument()
    expect(screen.getByText('Cell 1')).toBeInTheDocument()
    expect(screen.getByText('Cell 2')).toBeInTheDocument()
  })
})
