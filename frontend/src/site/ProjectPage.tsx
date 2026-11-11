/* Article layout adapted from the Magic UI portfolio template's blog post page (MIT) — see THIRD_PARTY.md. */
import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams } from 'react-router-dom'
import { LinkBadge } from './HomePage'
import Markdown from './Markdown'
import { NotFoundPage } from './SiteLayout'
import { findProject, fmtPeriod, isExternal, profile, projectNeighbors } from './content'
import type { LinkKind, Metric, Project } from './types'
import { BLUR_FADE_DELAY, Badge, BlurFade, Icons, cn } from './ui'

const D = BLUR_FADE_DELAY
const LINK_ORDER: LinkKind[] = ['appstore', 'playstore', 'website', 'demo', 'github', 'slides', 'video']

export function BackLink({ to, label }: { readonly to: string; readonly label: string }) {
  return (
    <div className="flex justify-start gap-4 items-center">
      <Link
        to={to}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-2 py-1 inline-flex items-center gap-1 mb-6 group"
      >
        <Icons.chevronLeft className="size-3 group-hover:-translate-x-px transition-transform" />
        {label}
      </Link>
    </div>
  )
}

export function Divider() {
  return (
    <div className="my-6 flex w-full items-center">
      <div
        className="flex-1 h-px bg-border"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        }}
      />
    </div>
  )
}

function Section({ title, children, delay }: { readonly title: string; readonly children: ReactNode; readonly delay: number }) {
  return (
    <BlurFade delay={delay} inView>
      <section className="flex flex-col gap-y-4 mt-12">
        <h2 className="text-xl font-bold">{title}</h2>
        {children}
      </section>
    </BlurFade>
  )
}

export function PrevNext({
  prev,
  next,
}: {
  readonly prev?: { title: string; to: string }
  readonly next?: { title: string; to: string }
}) {
  if (!prev && !next) return null
  const card = 'group flex-1 flex flex-col gap-1 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors'
  return (
    <nav className="mt-12 pt-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {prev ? (
          <Link to={prev.to} className={card}>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icons.chevronLeft className="size-3" />
              이전
            </span>
            <span className="text-sm font-medium break-words">{prev.title}</span>
          </Link>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}
        {next ? (
          <Link to={next.to} className={`${card} text-right`}>
            <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              다음
              <Icons.chevronRight className="size-3" />
            </span>
            <span className="text-sm font-medium break-words">{next.title}</span>
          </Link>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}
      </div>
    </nav>
  )
}

function Facts({ project }: { readonly project: Project }) {
  const rows: [string, string | undefined][] = [
    ['역할', project.role],
    ['팀', project.team],
    ['기간', fmtPeriod(project.period)],
    ['소속', project.org],
  ]
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-foreground">{v}</dd>
          </div>
        ))}
    </dl>
  )
}

/** Lime "담당" tag. Its own element: layering lime classes over <Badge> lost to bg-primary in the production CSS order. */
function MineBadge({ className }: { readonly className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-md bg-lime-300 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-900', className)}>
      담당
    </span>
  )
}

/** Shipped app: its store screens, with the parts I built marked. */
function Screens({ project }: { readonly project: Project }) {
  const product = project.product!
  return (
    <div className="flex flex-col gap-4">
      {product.features.some((f) => f.mine) && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <MineBadge />
          표시한 화면이 내가 만든 부분입니다
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {product.features.map((f) => (
          <figure key={f.title} className="flex flex-col gap-2">
            <div
              className={cn(
                'relative aspect-[9/16] overflow-hidden rounded-xl border bg-muted',
                f.mine && 'ring-[3px] ring-lime-400 ring-offset-2 ring-offset-background border-transparent',
              )}
            >
              <img src={f.image} alt={`${f.title} 화면`} loading="lazy" className="h-full w-full object-cover object-top" />
              {f.mine && <MineBadge className="absolute top-2 left-2" />}
            </div>
            <figcaption className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{f.title}</span>
              <span className="text-xs text-muted-foreground leading-relaxed">{f.text}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

const decimals = (n: number) => (String(n).split('.')[1] ?? '').length
const fmtNum = (n: number, unit = '', dp = decimals(n)) =>
  `${n.toLocaleString('ko-KR', { minimumFractionDigits: dp, maximumFractionDigits: dp })}${unit}`

/** One bar of a before/after pair; both bars share the larger value as their scale. */
function PairBar({ label, value, max, unit, dp, now }: { readonly label: string; readonly value: number; readonly max: number; readonly unit?: string; readonly dp: number; readonly now?: boolean }) {
  return (
    <div className="grid grid-cols-[2rem_1fr_auto] items-center gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-2">
        <div
          className={cn('h-full rounded-r-[4px]', now ? 'bg-foreground' : 'bg-muted-foreground/35')}
          style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
        />
      </div>
      <span className={cn('tabular-nums', now ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{fmtNum(value, unit, dp)}</span>
    </div>
  )
}

function MetricCard({ m }: { readonly m: Metric }) {
  const pair = m.before !== undefined && m.after !== undefined
  const meter = m.part !== undefined && m.whole !== undefined
  const max = pair ? Math.max(m.before!, m.after!) : 0
  // 16.0 parses as 16; print both bars with the finer side's decimals (33.1 / 16.0).
  const dp = pair ? Math.max(decimals(m.before!), decimals(m.after!)) : 0
  return (
    <div className="flex flex-col gap-3 rounded-xl border p-4 bg-card">
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-semibold tracking-tighter tabular-nums">{m.value}</span>
        <span className="text-sm font-medium">{m.label}</span>
      </div>
      {pair && (
        <div className="flex flex-col gap-1.5" aria-label={`이전 ${fmtNum(m.before!, m.unit, dp)}, 이후 ${fmtNum(m.after!, m.unit, dp)}`}>
          <PairBar label="이전" value={m.before!} max={max} unit={m.unit} dp={dp} />
          <PairBar label="이후" value={m.after!} max={max} unit={m.unit} dp={dp} now />
        </div>
      )}
      {meter && (
        <div className="grid grid-cols-[1fr_auto] items-center gap-2 text-xs">
          <div className="h-2 rounded-[4px] bg-muted overflow-hidden">
            <div className="h-full rounded-r-[4px] bg-foreground" style={{ width: `${(m.part! / m.whole!) * 100}%` }} />
          </div>
          <span className="tabular-nums font-semibold">
            {fmtNum(m.part!)} / {fmtNum(m.whole!, m.unit)}
          </span>
        </div>
      )}
      <span className="mt-auto text-xs text-muted-foreground leading-relaxed">{m.scope}</span>
    </div>
  )
}

/** Metric cards, under their `group` headings when the content gives them. */
function Metrics({ metrics }: { readonly metrics: readonly Metric[] }) {
  const groups: { name?: string; items: Metric[] }[] = []
  for (const m of metrics) {
    const g = groups.find((x) => x.name === m.group)
    if (g) g.items.push(m)
    else groups.push({ name: m.group, items: [m] })
  }
  return (
    <div className="flex flex-col gap-6">
      {groups.map((g) => (
        <div key={g.name ?? ''} className="flex flex-col gap-3">
          {g.name && <h3 className="text-sm font-semibold text-muted-foreground">{g.name}</h3>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
            {g.items.map((m) => (
              <MetricCard key={m.label} m={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProjectPage() {
  const { slug = '' } = useParams()
  const project = findProject(slug)
  if (!project || (project.status === 'archived' && !project.merged_into)) return <NotFoundPage />
  if (project.merged_into) return <Navigate to={`/projects/${project.merged_into}`} replace />
  if (project.slug !== slug) return <Navigate to={`/projects/${project.slug}`} replace />

  const product = project.product
  const links = LINK_ORDER.filter((k) => project.links?.[k] && isExternal(project.links[k]!))
  const video = project.links?.video && !isExternal(project.links.video) ? project.links.video : undefined
  const gallery = product ? [] : (project.gallery ?? []).filter((src) => src !== project.cover)
  const { prev, next } = projectNeighbors(project.slug)

  return (
    <>
      <Helmet>
        <title>{`${project.title} | ${profile.name}`}</title>
        <meta name="description" content={project.summary} />
      </Helmet>
      <article id="project">
        <BlurFade delay={D}>
          <BackLink to="/#projects" label="프로젝트 목록" />
          <div className="flex flex-col gap-4">
            {product?.icon && (
              <div className="flex items-center gap-3">
                <img src={product.icon} alt="" className="size-10 rounded-xl border" />
                <span className="text-sm font-semibold">{product.name}</span>
              </div>
            )}
            <h1 className="font-semibold text-3xl md:text-4xl tracking-tighter leading-tight">{project.title}</h1>
            <p className="text-sm text-muted-foreground">
              {fmtPeriod(project.period)}
              {project.org && ` · ${project.org}`}
            </p>
            <p className="text-muted-foreground leading-relaxed">{product?.about ?? project.summary}</p>
            {(links.length > 0 || project.awards) && (
              <div className="flex flex-wrap gap-2">
                {links.map((k) => (
                  <LinkBadge key={k} kind={k} href={project.links![k]!} />
                ))}
                {project.awards?.map((a) => (
                  <Badge key={a} variant="secondary">
                    {a}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </BlurFade>

        <Divider />

        <BlurFade delay={D * 2}>
          {product ? (
            <Screens project={project} />
          ) : (
            project.cover && (
              <img
                src={project.cover}
                alt={`${project.title} 대표 이미지`}
                className="w-full max-h-[420px] object-cover object-top rounded-xl border bg-muted"
              />
            )
          )}
        </BlurFade>

        {(project.role || project.responsibilities) && (
          <Section title="내가 맡은 일" delay={D * 3}>
            <Facts project={project} />
            {project.responsibilities && (
              <ul className="flex flex-col gap-3 mt-2">
                {project.responsibilities.map((r) => {
                  const [head, ...rest] = r.split(' — ')
                  return (
                    <li key={r} className="flex flex-col gap-0.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">{head}</span>
                      {rest.length > 0 && <span>{rest.join(' ')}</span>}
                    </li>
                  )
                })}
              </ul>
            )}
          </Section>
        )}

        {project.metrics && (
          <Section title="성과" delay={D * 4}>
            <Metrics metrics={project.metrics} />
          </Section>
        )}

        {(video || gallery.length > 0) && (
          <Section title={video ? '시연' : '화면'} delay={D * 5}>
            {video && <video className="w-full rounded-xl border bg-black" src={video} controls preload="metadata" />}
            {gallery.map((src, i) => (
              <img key={src} src={src} alt={`${project.title} 화면 ${i + 1}`} loading="lazy" className="w-full rounded-xl border" />
            ))}
          </Section>
        )}

        {project.body.trim() && (
          <BlurFade delay={D * 6} inView>
            <div className="mt-12">
              <Markdown source={project.body} />
            </div>
          </BlurFade>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-1">
            {project.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-[11px] font-medium border border-border h-6 w-fit px-2">
                {t}
              </Badge>
            ))}
          </div>
        )}

        <PrevNext
          prev={prev && { title: prev.title, to: `/projects/${prev.slug}` }}
          next={next && { title: next.title, to: `/projects/${next.slug}` }}
        />
      </article>
    </>
  )
}
