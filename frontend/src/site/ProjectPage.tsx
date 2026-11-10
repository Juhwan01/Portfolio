/* Article layout adapted from the Magic UI portfolio template's blog post page (MIT) — see THIRD_PARTY.md. */
import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams } from 'react-router-dom'
import { LinkBadge } from './HomePage'
import Markdown from './Markdown'
import { NotFoundPage } from './SiteLayout'
import { findProject, fmtPeriod, isExternal, profile, projectNeighbors } from './content'
import type { LinkKind, Project } from './types'
import { BLUR_FADE_DELAY, Badge, BlurFade, Icons } from './ui'

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

/** Shipped app: its store screens, with the parts I built marked. */
function Screens({ project }: { readonly project: Project }) {
  const product = project.product!
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {product.features.map((f) => (
        <figure key={f.title} className="flex flex-col gap-2">
          <div className="relative aspect-[9/16] overflow-hidden rounded-xl border bg-muted">
            <img src={f.image} alt={`${f.title} 화면`} loading="lazy" className="h-full w-full object-cover object-top" />
            {f.mine && <Badge className="absolute top-2 left-2 text-[11px]">담당</Badge>}
          </div>
          <figcaption className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">{f.title}</span>
            <span className="text-xs text-muted-foreground leading-relaxed">{f.text}</span>
          </figcaption>
        </figure>
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
        <title>{`${project.title} — ${profile.name}`}</title>
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
                    <li key={r} className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">{head}</span>
                      {rest.length > 0 && <> — {rest.join(' — ')}</>}
                    </li>
                  )
                })}
              </ul>
            )}
          </Section>
        )}

        {project.metrics && (
          <Section title="성과" delay={D * 4}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-1 rounded-xl border p-4 bg-card">
                  <span className="text-2xl font-semibold tracking-tighter tabular-nums">{m.value}</span>
                  <span className="text-sm font-medium">{m.label}</span>
                  <span className="text-xs text-muted-foreground leading-relaxed">{m.scope}</span>
                </div>
              ))}
            </div>
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
