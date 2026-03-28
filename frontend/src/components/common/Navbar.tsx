import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/skills', label: 'Skills' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
]

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMobileOpen(false), [location.pathname])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav aria-label="Main Navigation" className="fixed top-0 w-full z-50 bg-[#131319]/60 backdrop-blur-xl shadow-[0_0_40px_rgba(55,19,236,0.08)]">
      <div className="flex justify-between items-center px-8 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tighter text-[#f9f5fd]">
          Jung Juhwan
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center font-medium tracking-tight">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                isActive(item.path)
                  ? 'text-[#a8a4ff] font-bold border-b-2 border-[#3713ec] pb-1'
                  : 'text-[#acaab1] hover:text-[#f9f5fd] transition-colors'
              }
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          to="/contact"
          className="hidden md:block bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-6 py-2 rounded-md font-bold scale-95 active:scale-90 transition-transform"
        >
          Contact
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#f9f5fd] p-2"
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
        <div className="md:hidden px-8 pb-6 flex flex-col gap-2 border-t border-outline-variant/10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-3 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'text-[#a8a4ff] font-bold'
                  : 'text-[#acaab1] hover:text-[#f9f5fd]'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="mt-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed px-6 py-2 rounded-md font-bold text-center text-sm"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
