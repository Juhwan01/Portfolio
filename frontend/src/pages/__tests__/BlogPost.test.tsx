import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'
import BlogPost from '@pages/BlogPost'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const filtered = { ...props }
      delete filtered.initial
      delete filtered.animate
      delete filtered.exit
      delete filtered.variants
      delete filtered.transition
      return <div {...filtered}>{children}</div>
    },
    article: ({ children, ...props }: any) => {
      const filtered = { ...props }
      delete filtered.initial
      delete filtered.animate
      delete filtered.exit
      delete filtered.variants
      delete filtered.transition
      return <article {...filtered}>{children}</article>
    },
  },
  AnimatePresence: ({ children }: any) => children,
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderWithRoute(id: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/blog/${id}`]}>
        <Routes>
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )
}

describe('BlogPost', () => {
  it('shows loading skeleton initially', () => {
    renderWithRoute('test-blog-1')
    const pulseElements = document.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })

  it('shows blog post title after loading', async () => {
    renderWithRoute('test-blog-1')
    await waitFor(() => {
      expect(screen.getByText('Understanding Transformers')).toBeInTheDocument()
    })
  })

  it('shows "Post not found" when API returns 404', async () => {
    server.use(
      http.get('http://localhost:8000/api/blog/:id', () => {
        return new HttpResponse(null, { status: 404 })
      })
    )
    renderWithRoute('non-existent')
    await waitFor(() => {
      expect(screen.getByText('Post not found')).toBeInTheDocument()
    })
  })

  it('has "Back to Blog" link after loading', async () => {
    renderWithRoute('test-blog-1')
    await waitFor(() => {
      expect(screen.getByText(/Back to Blog/)).toBeInTheDocument()
    })
    const backLink = screen.getByText(/Back to Blog/)
    expect(backLink.closest('a')).toHaveAttribute('href', '/blog')
  })
})
