import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { profile } from './content'

/** Scroll to the hash target on navigation, or to the top for a new page. */
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
}

export default function SiteLayout() {
  useScrollOnNavigate()
  return (
    <>
      <a href="#main" className="skip-link">
        본문으로 건너뛰기
      </a>
      <header className="site-header">
        <div className="wrap">
          <Link to="/" className="brand">
            {profile.name}
          </Link>
          <nav className="nav" aria-label="주요 메뉴">
            <Link to="/#work">작업</Link>
            <Link to="/#field">현장</Link>
            <Link to="/#experience">경력</Link>
            <a href={`mailto:${profile.links.email}`}>연락</a>
          </nav>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.name_en}
          </span>
          <span className="footer-links">
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            {profile.links.blog && (
              <a href={profile.links.blog} target="_blank" rel="noreferrer">
                Blog
              </a>
            )}
            <a href={`mailto:${profile.links.email}`}>{profile.links.email}</a>
          </span>
        </div>
      </footer>
    </>
  )
}

export function NotFoundPage() {
  return (
    <div className="wrap not-found">
      <p className="mono muted">404</p>
      <h1>페이지를 찾을 수 없습니다</h1>
      <Link to="/">처음으로</Link>
    </div>
  )
}
