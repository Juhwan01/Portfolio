import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import ProjectCarousel from '../ProjectCarousel'
import { mockProjects } from '@/test/mocks/data'

describe('ProjectCarousel', () => {
  it('shows empty message when no projects', () => {
    render(<ProjectCarousel projects={[]} />)
    expect(screen.getByText('등록된 프로젝트가 없습니다.')).toBeInTheDocument()
  })

  it('renders project titles from array', () => {
    render(<ProjectCarousel projects={mockProjects} />)
    expect(screen.getByText('AI ChatBot')).toBeInTheDocument()
    expect(screen.getByText('Portfolio Website')).toBeInTheDocument()
  })

  it('each project links to /project/:id', () => {
    render(<ProjectCarousel projects={mockProjects} />)
    const links = screen.getAllByRole('link')
    expect(links.some((link) => link.getAttribute('href') === '/project/test-project-1')).toBe(true)
    expect(links.some((link) => link.getAttribute('href') === '/project/test-project-2')).toBe(true)
  })
})
