import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/skills', label: 'Skills' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location.pathname])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-[#0e0e13]/80 backdrop-blur-xl border-b border-[#48474d]/10'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-16">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-[#f9f5fd] hover:text-[#a8a4ff] transition-colors">
            JW<span className="text-[#665bff]">.</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-[#a8a4ff] bg-[#a8a4ff]/10'
                    : 'text-[#acaab1] hover:text-[#f9f5fd] hover:bg-[#f9f5fd]/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#f9f5fd] p-2 rounded-lg hover:bg-[#f9f5fd]/5 transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 pt-2 flex flex-col gap-1 border-t border-[#48474d]/10">
            {[{ path: '/', label: 'Home' }, ...navItems].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-lg text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'text-[#a8a4ff] bg-[#a8a4ff]/10'
                    : 'text-[#acaab1] hover:text-[#f9f5fd] hover:bg-[#f9f5fd]/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
