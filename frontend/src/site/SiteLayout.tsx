import { useEffect, type ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { profile } from './content'
import { Dock, DockIcon, FlickeringGrid, Icons, MotionProvider, Tip, useTheme } from './ui'

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

const dockIconClass =
  'rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors'

function DockLink({ to, label, children }: { readonly to: string; readonly label: string; readonly children: ReactNode }) {
  const external = /^(https?:|mailto:)/.test(to)
  const icon = <DockIcon className={dockIconClass}>{children}</DockIcon>
  return (
    <Tip label={label}>
      {external ? (
        <a href={to} target={to.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={label}>
          {icon}
        </a>
      ) : (
        <Link to={to} aria-label={label}>
          {icon}
        </Link>
      )}
    </Tip>
  )
}

function Navbar() {
  const { dark, toggle } = useTheme()
  const { links } = profile
  const iconClass = 'size-full'
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
      <Dock className="z-50 pointer-events-auto relative h-14 p-2 w-fit mx-auto flex gap-2 border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
        <DockLink to="/" label="홈">
          <Icons.home className={iconClass} />
        </DockLink>
        <DockLink to="/blog" label="글">
          <Icons.book className={iconClass} />
        </DockLink>
        <div className="h-2/3 m-auto w-px bg-border" aria-hidden="true" />
        <DockLink to={links.github} label="GitHub">
          <Icons.github className={iconClass} />
        </DockLink>
        {links.blog && (
          <DockLink to={links.blog} label="velog">
            <Icons.pen className={iconClass} />
          </DockLink>
        )}
        <DockLink to={`mailto:${links.email}`} label="메일">
          <Icons.mail className={iconClass} />
        </DockLink>
        <div className="h-2/3 m-auto w-px bg-border" aria-hidden="true" />
        <Tip label={dark ? '밝은 화면' : '어두운 화면'}>
          <button type="button" onClick={toggle} aria-label="화면 테마 바꾸기">
            <DockIcon className={dockIconClass}>
              {dark ? <Icons.moon className={iconClass} /> : <Icons.sun className={iconClass} />}
            </DockIcon>
          </button>
        </Tip>
      </Dock>
    </div>
  )
}

export default function SiteLayout() {
  useScrollOnNavigate()
  return (
    <MotionProvider>
    <div className="min-h-screen bg-background font-sans antialiased relative">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
      >
        본문으로 건너뛰기
      </a>
      <div className="absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: 'linear-gradient(to bottom, black, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
          }}
        />
      </div>
      <div id="main" className="relative z-10 max-w-2xl mx-auto py-12 pb-24 sm:py-24 px-6">
        <Outlet />
        <footer className="mt-16 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.name_en}
          </span>
          <span>juhwan.dev</span>
        </footer>
      </div>
      <Navbar />
    </div>
    </MotionProvider>
  )
}

export function NotFoundPage() {
  return (
    <section className="flex flex-col gap-4 py-16">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tighter">페이지를 찾을 수 없습니다</h1>
      <Link to="/" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
        처음으로
      </Link>
    </section>
  )
}
