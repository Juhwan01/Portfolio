import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import ProjectSidebar from '@components/content/ProjectSidebar'
import { mockProject } from '@/test/mocks/data'

describe('ProjectSidebar', () => {
  it('renders "Project Info" heading', () => {
    render(<ProjectSidebar project={mockProject} />)
    expect(screen.getByText('Project Info')).toBeInTheDocument()
  })

  it('shows category badge', () => {
    render(<ProjectSidebar project={mockProject} />)
    expect(screen.getByText('AI')).toBeInTheDocument()
  })

  it('shows status badge', () => {
    render(<ProjectSidebar project={mockProject} />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('shows tech stack badges', () => {
    render(<ProjectSidebar project={mockProject} />)
    expect(screen.getByText('Tech Stack')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
    expect(screen.getByText('FastAPI')).toBeInTheDocument()
    expect(screen.getByText('OpenAI')).toBeInTheDocument()
  })

  it('shows team composition when present', () => {
    render(<ProjectSidebar project={mockProject} />)
    expect(screen.getByText('3 members')).toBeInTheDocument()
    expect(screen.getByText('Frontend 2')).toBeInTheDocument()
    expect(screen.getByText('Backend 1')).toBeInTheDocument()
  })

  it('shows GitHub and Demo links when present', () => {
    render(<ProjectSidebar project={mockProject} />)
    expect(screen.getByText('GitHub Repository')).toBeInTheDocument()
    expect(screen.getByText('Live Demo')).toBeInTheDocument()
  })
})
