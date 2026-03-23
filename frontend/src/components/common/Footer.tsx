import { Link } from 'react-router-dom'
import { SOCIAL_LINKS } from '@utils/constants'

const quickLinks = [
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/skills', label: 'Skills' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
]

const Footer = () => {
  return (
    <footer className="bg-nn-surface-low py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold nn-gradient-text mb-4">Jung Juhwan</h3>
            <p className="text-nn-on-surface-variant">
              AI Engineer specialized in LLMs, NLP, and Machine Learning systems.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-nn-on-surface mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-nn-on-surface-variant hover:text-nn-on-surface transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-nn-on-surface mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nn-on-surface-variant hover:text-nn-primary transition-colors"
              >
                GitHub
              </a>
              <a
                href={SOCIAL_LINKS.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nn-on-surface-variant hover:text-nn-primary transition-colors"
              >
                Blog
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-nn-outline-variant/15 text-center text-nn-on-surface-variant">
          <p>&copy; {new Date().getFullYear()} Jung Juhwan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
