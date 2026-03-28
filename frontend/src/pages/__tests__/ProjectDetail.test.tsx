import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'
import ProjectDetail from '@pages/ProjectDetail'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const filtered = { ...props }
      delete filtered.initial
      delete filtered.animate
      delete filtered.exit
      delete filtered.variants
      delete filtered.transition
      delete filtered.whileInView
      delete filtered.viewport
      return <div {...filtered}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: any) => children,
}))

vi.mock('@components/common/SlideViewer', () => ({
  default: () => <div data-testid="slide-viewer">SlideViewer</div>,
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderWithRoute(id: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/projects/${id}`]}>
        <Routes>
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )
}

describe('ProjectDetail', () => {
  it('shows loading skeleton initially', () => {
    renderWithRoute('test-project-1')
    const pulseElements = document.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })

  it('shows project title after loading', async () => {
    renderWithRoute('test-project-1')
    await waitFor(() => {
      expect(screen.getByText('AI ChatBot')).toBeInTheDocument()
    })
  })

  it('shows "Project not found" when API returns 404', async () => {
    server.use(
      http.get('http://localhost:8000/api/projects/:id', () => {
        return new HttpResponse(null, { status: 404 })
      })
    )
    renderWithRoute('non-existent')
    await waitFor(() => {
      expect(screen.getByText('Project not found')).toBeInTheDocument()
    })
  })

  it('has "Back to Projects" link after loading', async () => {
    renderWithRoute('test-project-1')
    await waitFor(() => {
      expect(screen.getByText(/Back to Projects/)).toBeInTheDocument()
    })
    const backLink = screen.getByText(/Back to Projects/)
    expect(backLink.closest('a')).toHaveAttribute('href', '/projects')
  })
})
