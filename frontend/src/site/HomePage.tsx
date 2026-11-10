/* Layout adapted from the Magic UI portfolio template (MIT) — see THIRD_PARTY.md. */
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  LINK_LABELS,
  featuredProjects,
  findProject,
  fmtDate,
  fmtMonth,
  fmtPeriod,
  isExternal,
  otherProjects,
  profile,
  skillList,
  sortedPosts,
} from './content'
import Markdown from './Markdown'
import type { LinkKind, ProfileItem, Project } from './types'
import { BLUR_FADE_DELAY, Badge, BlurFade, FlickeringGrid, Icons, LogoMark, SectionPill, cn } from './ui'

const D = BLUR_FADE_DELAY

/* ---------- hero ---------- */

function Hero() {
  return (
    <section id="hero">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
          <div className="gap-2 flex flex-col order-2 md:order-1">
            <BlurFade delay={D} yOffset={8}>
              <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl">
                안녕하세요, {profile.name}입니다
              </h1>
            </BlurFade>
            <BlurFade delay={D}>
              <p className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl">{profile.headline}</p>
            </BlurFade>
          </div>
          <BlurFade delay={D} className="order-1 md:order-2">
            <div className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted bg-muted flex items-center justify-center overflow-hidden">
              <span className="text-2xl md:text-3xl font-semibold tracking-tight text-muted-foreground">
                {profile.name.slice(1)}
              </span>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about">
      <div className="flex min-h-0 flex-col gap-y-4">
        <BlurFade delay={D * 3}>
          <h2 className="text-xl font-bold">소개</h2>
        </BlurFade>
        <BlurFade delay={D * 4}>
          <Markdown source={profile.about} className="font-sans" />
        </BlurFade>
      </div>
    </section>
  )
}

/* ---------- experience (accordion) ---------- */

function DatedRow({ item, title, sub, open }: { readonly item: ProfileItem; readonly title: string; readonly sub?: string; readonly open?: boolean }) {
  return (
    <div className="flex items-center gap-x-3 justify-between w-full text-left">
      <div className="flex items-center gap-x-3 flex-1 min-w-0">
        <LogoMark text={item.mark ?? item.org.slice(0, 2)} />
        <div className="flex-1 min-w-0 gap-0.5 flex flex-col">
          <div className="font-semibold leading-snug flex items-center gap-2">
            {title}
            {open !== undefined && (
              <span className="relative inline-flex items-center w-3.5 h-3.5 shrink-0">
                <Icons.chevronRight
                  className={cn(
                    'absolute h-3.5 w-3.5 text-muted-foreground transition-all duration-300 ease-out',
                    open ? 'opacity-0' : 'opacity-0 group-hover:translate-x-1 group-hover:opacity-100',
                  )}
                />
                <Icons.chevronDown
                  className={cn(
                    'absolute h-3.5 w-3.5 text-muted-foreground transition-all duration-200',
                    open ? 'opacity-100 rotate-180' : 'opacity-0',
                  )}
                />
              </span>
            )}
          </div>
          {sub && <div className="font-sans text-sm text-muted-foreground">{sub}</div>}
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
        <span>{fmtPeriod(item.period)}</span>
      </div>
    </div>
  )
}

function Work() {
  const [open, setOpen] = useState<string | null>(profile.experience[0]?.org ?? null)
  return (
    <section id="work">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={D * 5}>
          <h2 className="text-xl font-bold">경력</h2>
        </BlurFade>
        <BlurFade delay={D * 6}>
          <div className="w-full grid gap-6">
            {profile.experience.map((work) => {
              const isOpen = open === work.org
              return (
                <div key={work.org} className="w-full grid gap-2">
                  <button
                    type="button"
                    className="group w-full cursor-pointer"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : work.org)}
                  >
                    <DatedRow item={work} title={work.org} sub={work.role} open={isOpen} />
                  </button>
                  {isOpen && work.points && (
                    <ul className="ml-11 md:ml-[3.25rem] list-disc pl-4 space-y-1 text-xs sm:text-sm text-muted-foreground">
                      {work.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

function Education() {
  return (
    <section id="education">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={D * 7}>
          <h2 className="text-xl font-bold">학력</h2>
        </BlurFade>
        <div className="flex flex-col gap-8">
          {profile.education.map((e, i) => (
            <BlurFade key={e.org} delay={D * 8 + i * 0.05}>
              <div className="flex flex-col gap-2">
                <DatedRow item={e} title={e.org} sub={[e.degree, e.note].filter(Boolean).join(' · ')} />
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- skills ---------- */

function Skills() {
  return (
    <section id="skills">
      <div className="flex min-h-0 flex-col gap-y-4">
        <BlurFade delay={D * 9}>
          <h2 className="text-xl font-bold">기술</h2>
        </BlurFade>
        <div className="flex flex-wrap gap-2">
          {skillList.map((s, i) => (
            <BlurFade key={s.name} delay={D * 10 + i * 0.05}>
              <div
                title={s.projects.length ? `쓴 프로젝트: ${s.projects.map((p) => p.title).join(', ')}` : undefined}
                className="border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2"
              >
                <span className="text-foreground text-sm font-medium">{s.name}</span>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- projects ---------- */

const CARD_LINKS: LinkKind[] = ['appstore', 'website', 'github', 'demo']
const LINK_ICON: Partial<Record<LinkKind, keyof typeof Icons>> = {
  appstore: 'phone',
  playstore: 'phone',
  website: 'globe',
  demo: 'globe',
  github: 'github',
  video: 'play',
  slides: 'file',
}

/** A link as a badge. `overlay` is the fixed black style used on top of card images. */
export function LinkBadge({ kind, href, overlay }: { readonly kind: LinkKind; readonly href: string; readonly overlay?: boolean }) {
  const Icon = Icons[LINK_ICON[kind] ?? 'globe']
  return (
    <a href={href} target={isExternal(href) ? '_blank' : undefined} rel="noreferrer" onClick={(e) => e.stopPropagation()}>
      <Badge
        variant={overlay ? 'outline' : 'default'}
        className={cn('flex items-center gap-1.5 text-xs', overlay && 'border-transparent bg-black text-white hover:bg-black/90')}
      >
        <Icon className="size-3" />
        {LINK_LABELS[kind]}
      </Badge>
    </a>
  )
}

function ProjectCard({ project }: { readonly project: Project }) {
  const links = CARD_LINKS.filter((k) => project.links?.[k] && isExternal(project.links[k]!)).slice(0, 2)
  const to = `/projects/${project.slug}`
  return (
    <div className="flex flex-col h-full border border-border rounded-xl overflow-hidden hover:ring-2 hover:ring-muted transition-all duration-200 bg-card">
      <div className="relative shrink-0">
        <Link to={to} className="block" tabIndex={-1} aria-hidden="true">
          {project.cover ? (
            <img src={project.cover} alt="" loading="lazy" className="w-full h-48 object-cover object-top bg-muted" />
          ) : (
            <div className="w-full h-48 bg-muted flex flex-col items-center justify-center gap-1">
              {project.metrics?.[0] && (
                <>
                  <span className="text-3xl font-semibold tracking-tighter">{project.metrics[0].value}</span>
                  <span className="text-xs text-muted-foreground">{project.metrics[0].label}</span>
                </>
              )}
            </div>
          )}
        </Link>
        {links.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-2">
            {links.map((k) => (
              <LinkBadge key={k} kind={k} href={project.links![k]!} overlay />
            ))}
          </div>
        )}
      </div>
      <Link to={to} className="p-6 flex flex-col gap-3 flex-1 group">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{project.title}</h3>
            <time className="text-xs text-muted-foreground">
              {fmtPeriod(project.period)}
              {project.org && ` · ${project.org}`}
            </time>
          </div>
          <Icons.arrowUpRight className="h-4 w-4 flex-none text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
        <p className="text-xs flex-1 text-pretty leading-relaxed text-muted-foreground">{project.summary}</p>
        {project.awards?.[0] && (
          <Badge variant="secondary" className="w-fit text-[11px] font-medium">
            {project.awards[0]}
          </Badge>
        )}
        {project.tags && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {project.tags.slice(0, 6).map((t) => (
              <Badge key={t} variant="outline" className="text-[11px] font-medium border border-border h-6 w-fit px-2">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </Link>
    </div>
  )
}

function Projects() {
  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <SectionPill label="프로젝트" />
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">만들고 운영한 것들</h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
              출시한 서비스와 수상·입상한 프로젝트입니다. 카드를 누르면 맥락과 결정, 결과를 정리한 글로 이어집니다.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto auto-rows-fr w-full">
          {featuredProjects.map((p, i) => (
            <BlurFade key={p.slug} delay={D * 12 + i * 0.05} className="h-full">
              <ProjectCard project={p} />
            </BlurFade>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold tracking-tight">그 밖의 프로젝트</h3>
          <div className="flex flex-col gap-4">
            {otherProjects.map((p, i) => (
              <Link
                key={p.slug}
                to={`/projects/${p.slug}`}
                className="flex items-start gap-x-2 group cursor-pointer"
              >
                <span className="text-xs font-mono tabular-nums font-medium mt-[5px] text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <div className="flex flex-col gap-y-1 flex-1 min-w-0">
                  <p className="tracking-tight font-medium">
                    {p.title}
                    <Icons.chevronRight className="ml-1 inline-block size-4 [stroke-width:3] text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.summary}</p>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground mt-[5px]">{fmtMonth(p.period.start).slice(0, 4)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- awards, competitions, field, open source (timeline) ---------- */

interface TimelineEntry {
  date: string
  title: string
  mark: string
  image?: string
  place?: string
  description?: string
  links: { label: string; href: string }[]
}

function timelineEntries(): TimelineEntry[] {
  const projectLink = (slug?: string) => {
    const p = slug ? findProject(slug) : undefined
    return p ? [{ label: p.title, href: `/projects/${p.slug}` }] : []
  }
  const awards: TimelineEntry[] = profile.awards.map((a) => ({
    date: a.date,
    title: a.title,
    mark: '수상',
    links: projectLink(a.project),
  }))
  const competitions: TimelineEntry[] = profile.competitions.map((c) => ({
    date: c.date,
    title: c.title,
    mark: '대회',
    links: projectLink(c.project),
  }))
  const field: TimelineEntry[] = profile.activities.map((a) => ({
    date: a.period.start,
    title: a.title,
    mark: '현장',
    image: a.photos?.[0],
    place: [a.date_detail, a.place].filter(Boolean).join(' · '),
    description: a.summary,
    links: a.links?.event ? [{ label: '행사 소개', href: a.links.event }] : [],
  }))
  const openSource: TimelineEntry[] = profile.open_source.map((o) => {
    const p = o.project ? findProject(o.project) : undefined
    return {
      date: p?.period.start ?? '',
      title: `${o.title} 공개`,
      mark: 'OSS',
      description: o.note,
      links: [
        ...projectLink(o.project),
        ...(p?.links?.github ? [{ label: 'GitHub', href: p.links.github }] : []),
      ],
    }
  })
  return [...awards, ...competitions, ...field, ...openSource].sort((a, b) => b.date.localeCompare(a.date))
}

function Recognition() {
  const entries = timelineEntries()
  return (
    <section id="recognition" className="overflow-hidden">
      <div className="flex min-h-0 flex-col gap-y-8 w-full">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <SectionPill label="수상 · 활동" />
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">대회와 현장에서</h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
              수상과 대회 성적, 부스 전시, 공개한 오픈소스입니다.
            </p>
          </div>
        </div>
        <ol className="flex flex-col p-4 w-full">
          {entries.map((e, i) => (
            <li key={e.title} className="relative w-full flex items-start justify-between gap-6 sm:gap-10 pb-8 last:pb-0">
              <div className="relative flex shrink-0 justify-center self-stretch">
                {i < entries.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 h-[calc(100%+2rem)] w-px bg-border" aria-hidden="true" />
                )}
                <div className="relative z-10">
                  {e.image ? (
                    <img
                      src={e.image}
                      alt=""
                      className="size-10 bg-card shrink-0 overflow-hidden border rounded-full shadow ring-2 ring-border object-cover flex-none"
                    />
                  ) : (
                    <div className="size-10 bg-card shrink-0 border rounded-full shadow ring-2 ring-border flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                      {e.mark}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-start gap-2 min-w-0">
                {e.date && <time className="text-xs text-muted-foreground">{fmtMonth(e.date)}</time>}
                <h3 className="font-semibold leading-snug">{e.title}</h3>
                {e.place && <p className="text-sm text-muted-foreground">{e.place}</p>}
                {e.description && <p className="text-sm text-muted-foreground leading-relaxed break-words">{e.description}</p>}
                {e.links.length > 0 && (
                  <div className="mt-1 flex flex-row flex-wrap items-start gap-2">
                    {e.links.map((l) =>
                      isExternal(l.href) ? (
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                          <Badge className="flex items-center gap-1.5 text-xs">{l.label}</Badge>
                        </a>
                      ) : (
                        <Link key={l.href} to={l.href}>
                          <Badge className="flex items-center gap-1.5 text-xs">{l.label}</Badge>
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- writing ---------- */

function Writing() {
  if (!sortedPosts.length) return null
  return (
    <section id="writing">
      <div className="flex min-h-0 flex-col gap-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold">글</h2>
          {profile.links.blog && (
            <a
              href={profile.links.blog}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              velog에서 더 보기 →
            </a>
          )}
        </div>
        <div className="flex flex-col gap-5">
          {sortedPosts.map((post, i) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="flex items-start gap-x-2 group cursor-pointer">
              <span className="text-xs font-mono tabular-nums font-medium mt-[5px]">{String(i + 1).padStart(2, '0')}.</span>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="tracking-tight text-lg font-medium">
                  {post.title}
                  <Icons.chevronRight className="ml-1 inline-block size-4 [stroke-width:3] text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                </p>
                <p className="text-xs text-muted-foreground">{fmtDate(post.published_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- contact ---------- */

function Contact() {
  const { links } = profile
  return (
    <section id="contact">
      <div className="border rounded-xl p-10 relative">
        <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
          <span className="text-background text-sm font-medium">연락</span>
        </div>
        <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 rounded-xl overflow-hidden">
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
        <div className="relative flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">연락하기</h2>
          <p className="mx-auto max-w-lg text-muted-foreground text-balance">
            채용이나 협업 제안, 궁금한 점이 있으면{' '}
            <a href={`mailto:${links.email}`} className="text-blue-500 hover:underline underline-offset-4">
              {links.email}
            </a>
            로 편하게 메일 주세요. 코드는{' '}
            <a href={links.github} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline underline-offset-4">
              GitHub
            </a>
            에서 볼 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>{`${profile.name} — ${profile.current.role}`}</title>
      </Helmet>
      <main className="min-h-dvh flex flex-col gap-14 relative">
        <Hero />
        <About />
        <Work />
        <Education />
        <Skills />
        <Projects />
        <BlurFade delay={D * 13} inView>
          <Recognition />
        </BlurFade>
        <BlurFade delay={D * 14} inView>
          <Writing />
        </BlurFade>
        <BlurFade delay={D * 16} inView>
          <Contact />
        </BlurFade>
      </main>
    </>
  )
}
