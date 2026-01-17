import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold gradient-text">
            Portfolio
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('projects')}
              className="hover:text-blue-400 transition"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="hover:text-blue-400 transition"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('blog')}
              className="hover:text-blue-400 transition"
            >
              Blog
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-2 glass rounded-lg hover:bg-white/20 transition"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
