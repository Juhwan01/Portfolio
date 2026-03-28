import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import AdminLayout from '@pages/admin/AdminLayout'
import { useAuthStore } from '@stores/authStore'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderAdminLayout() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Dashboard Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )
}

describe('AdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.getState().logout()
  })

  it('renders nothing when not authenticated', () => {
    const { container } = renderAdminLayout()
    expect(container.querySelector('aside')).toBeNull()
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument()
  })

  it('redirects to /admin/login when not authenticated', () => {
    renderAdminLayout()
    expect(mockNavigate).toHaveBeenCalledWith('/admin/login')
  })

  it('renders sidebar with nav items when authenticated', () => {
    useAuthStore.getState().login('test-token')
    renderAdminLayout()

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('renders outlet content when authenticated', () => {
    useAuthStore.getState().login('test-token')
    renderAdminLayout()

    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
  })
})
