import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PublicLayout from '@/layouts/PublicLayout'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const filtered = { ...props }
      const motionKeys = [
        'initial', 'animate', 'exit', 'variants', 'transition',
        'whileInView', 'viewport', 'whileHover', 'whileTap',
      ]
      for (const key of motionKeys) delete filtered[key]
      return <div {...filtered}>{children}</div>
    },
    span: ({ children, ...props }: any) => <span>{children}</span>,
    nav: ({ children, ...props }: any) => <nav>{children}</nav>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

function renderLayout() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <PublicLayout />
      </MemoryRouter>
    </HelmetProvider>
  )
}

describe('Accessibility', () => {
  it('has skip-to-content link with text "본문으로 건너뛰기"', () => {
    renderLayout()
    expect(screen.getByText('본문으로 건너뛰기')).toBeInTheDocument()
  })

  it('has main element with id="main-content"', () => {
    renderLayout()
    const main = document.getElementById('main-content')
    expect(main).toBeTruthy()
    expect(main!.tagName).toBe('MAIN')
  })

  it('navbar has aria-label="메인 네비게이션"', () => {
    renderLayout()
    const nav = screen.getByRole('navigation', { name: '메인 네비게이션' })
    expect(nav).toBeInTheDocument()
  })

  it('footer has aria-label="사이트 푸터"', () => {
    renderLayout()
    const footer = document.querySelector('footer[aria-label="사이트 푸터"]')
    expect(footer).toBeTruthy()
  })

  it('mobile menu button has aria-label="Toggle menu"', () => {
    renderLayout()
    const menuButton = screen.getByRole('button', { name: 'Toggle menu' })
    expect(menuButton).toBeInTheDocument()
  })
})
