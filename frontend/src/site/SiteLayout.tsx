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

function ContactBand() {
  const { links } = profile
  return (
    <section className="contact dark" aria-labelledby="contact">
      <div className="wrap">
        <p className="mono eyebrow">연락</p>
        <h2 id="contact">
          같이 만들 서비스가 있다면
          <br />
          편하게 연락 주세요.
        </h2>
        <div className="link-buttons">
          <a href={`mailto:${links.email}`} className="primary">
            {links.email}
          </a>
          <a href={links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          {links.blog && (
            <a href={links.blog} target="_blank" rel="noreferrer">
              Blog
            </a>
          )}
        </div>
      </div>
    </section>
  )
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
            <span className="brand-sub mono">{profile.name_en}</span>
          </Link>
          <nav className="nav" aria-label="주요 메뉴">
            <Link to="/#work">작업</Link>
            <Link to="/#stack">기술</Link>
            <Link to="/#writing">글</Link>
            <Link to="/#experience">경력</Link>
            <a href="#contact" className="nav-cta">
              연락
            </a>
          </nav>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <ContactBand />
      <footer className="site-footer dark">
        <div className="wrap">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.name_en}
          </span>
          <span className="mono">juhwan.dev</span>
        </div>
      </footer>
    </>
  )
}

export function NotFoundPage() {
  return (
    <section className="page-hero dark">
      <div className="wrap not-found">
        <p className="mono eyebrow">404</p>
        <h1>페이지를 찾을 수 없습니다</h1>
        <Link to="/" className="text-link">
          처음으로 →
        </Link>
      </div>
    </section>
  )
}
