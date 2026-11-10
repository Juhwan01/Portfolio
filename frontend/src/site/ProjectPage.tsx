import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams } from 'react-router-dom'
import Markdown from './Markdown'
import { NotFoundPage } from './SiteLayout'
import { LINK_LABELS, findProject, fmtPeriod, isExternal, nextProject, profile } from './content'
import { CoverFrame, accentStyle } from './parts'
import type { LinkKind, Metric, Project } from './types'

const LINK_ORDER: LinkKind[] = ['appstore', 'playstore', 'website', 'demo', 'github', 'slides', 'video']

function ProjectLinks({ project }: { readonly project: Project }) {
  const links = LINK_ORDER.filter((k) => project.links?.[k] && !(k === 'video' && !isExternal(project.links[k]!)))
  if (!links.length) return null
  return (
    <div className="link-buttons">
      {links.map((k, i) => (
        <a key={k} href={project.links![k]} target="_blank" rel="noreferrer" className={i === 0 ? 'primary' : undefined}>
          {LINK_LABELS[k]}
        </a>
      ))}
    </div>
  )
}

function Metrics({ metrics }: { readonly metrics: Metric[] }) {
  return (
    <ul className="metrics">
      {metrics.map((m) => (
        <li key={m.label} className="metric-card">
          <span className="value">{m.value}</span>
          <span className="label">{m.label}</span>
          <span className="scope">{m.scope}</span>
        </li>
      ))}
    </ul>
  )
}

function Block({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return (
    <section className="section">
      <div className="wrap block">
        <h2 className="block-title">{title}</h2>
        <div>{children}</div>
      </div>
    </section>
  )
}

function Tags({ tags }: { readonly tags?: string[] }) {
  if (!tags?.length) return null
  return (
    <ul className="tags">
      {tags.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}

/** Top panel: the app itself for a shipped product, otherwise the project with its cover. */
function Hero({ project }: { readonly project: Project }) {
  const product = project.product
  const phones = product?.features.filter((f) => f.mine).slice(0, 2) ?? []
  return (
    <section className="project-hero dark" style={accentStyle(project)}>
      <div className="wrap">
        <Link to="/#work" className="back">
          ← 작업 목록
        </Link>
        <div className={project.cover || phones.length ? 'project-hero-grid' : 'project-hero-grid single'}>
          <div>
            {product ? (
              <div className="app-id">
                {product.icon && <img src={product.icon} alt="" />}
                <div>
                  <strong>{product.name}</strong>
                  <span className="mono">
                    {project.org} · {fmtPeriod(project.period)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="mono eyebrow">
                {fmtPeriod(project.period)}
                {project.org && ` · ${project.org}`}
              </p>
            )}
            <h1>{product?.tagline ?? project.title}</h1>
            <p className="hero-lead">{product?.about ?? project.summary}</p>
            {project.awards && (
              <ul className="award-badges">
                {project.awards.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}
            <ProjectLinks project={project} />
          </div>
          {phones.length > 0 ? (
            <div className="phones" aria-hidden="true">
              {phones.map((f) => (
                <img key={f.image} src={f.image} alt="" className="phone" />
              ))}
            </div>
          ) : (
            project.cover && <CoverFrame project={project} />
          )}
        </div>

        {product && (
          <>
            <div className="features-head">
              <h2>앱 주요 기능</h2>
              <span className="legend">
                <span className="badge-mine">담당</span> 내가 만든 부분
              </span>
            </div>
            <ul className="features">
              {product.features.map((f) => (
                <li key={f.title} className={f.mine ? 'feature mine' : 'feature'}>
                  <figure>
                    <img src={f.image} alt={`${f.title} 화면`} loading="lazy" />
                  </figure>
                  <h3>
                    {f.title}
                    {f.mine && <span className="badge-mine">담당</span>}
                  </h3>
                  <p>{f.text}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}

function Duties({ project }: { readonly project: Project }) {
  return (
    <Block title="내가 맡은 일">
      <dl className="facts">
        {project.role && (
          <>
            <dt>역할</dt>
            <dd>{project.role}</dd>
          </>
        )}
        {project.team && (
          <>
            <dt>팀</dt>
            <dd>{project.team}</dd>
          </>
        )}
        <dt>기간</dt>
        <dd>{fmtPeriod(project.period)}</dd>
        {project.org && (
          <>
            <dt>소속</dt>
            <dd>{project.org}</dd>
          </>
        )}
      </dl>
      {project.responsibilities && (
        <ul className="duties">
          {project.responsibilities.map((r) => {
            const [head, ...rest] = r.split(' — ')
            return (
              <li key={r}>
                <strong>{head}</strong>
                {rest.length > 0 && <span> — {rest.join(' — ')}</span>}
              </li>
            )
          })}
        </ul>
      )}
    </Block>
  )
}

function Media({ project }: { readonly project: Project }) {
  const video = project.links?.video && !isExternal(project.links.video) ? project.links.video : undefined
  const gallery = project.product ? [] : (project.gallery ?? []).filter((src) => src !== project.cover)
  if (!video && !gallery.length) return null
  return (
    <Block title={video ? '시연' : '화면'}>
      {video && <video className="demo-video" src={video} controls preload="metadata" />}
      {gallery.length > 0 && (
        <div className="gallery">
          {gallery.map((src, i) => (
            <img key={src} src={src} alt={`${project.title} 화면 ${i + 1}`} loading="lazy" />
          ))}
        </div>
      )}
    </Block>
  )
}

function NextProject({ project }: { readonly project: Project }) {
  const next = nextProject(project.slug)
  if (!next) return null
  return (
    <section className="section">
      <div className="wrap">
        <Link to={`/projects/${next.slug}`} className="next-card" style={accentStyle(next)}>
          <span className="mono muted">다음 작업</span>
          <strong>{next.title} →</strong>
          <span className="muted">{next.summary}</span>
        </Link>
      </div>
    </section>
  )
}

export default function ProjectPage() {
  const { slug = '' } = useParams()
  const project = findProject(slug)
  if (!project || (project.status === 'archived' && !project.merged_into)) return <NotFoundPage />
  if (project.merged_into) return <Navigate to={`/projects/${project.merged_into}`} replace />
  if (project.slug !== slug) return <Navigate to={`/projects/${project.slug}`} replace />
  return (
    <>
      <Helmet>
        <title>{`${project.title} — ${profile.name}`}</title>
        <meta name="description" content={project.summary} />
      </Helmet>
      <Hero project={project} />
      {(project.role || project.responsibilities) && <Duties project={project} />}
      {project.metrics && (
        <Block title="성과">
          <Metrics metrics={project.metrics} />
        </Block>
      )}
      <Media project={project} />
      {project.body.trim() && (
        <Block title="자세히">
          <Markdown source={project.body} />
        </Block>
      )}
      {project.tags?.length ? (
        <Block title="기술">
          <Tags tags={project.tags} />
        </Block>
      ) : null}
      <NextProject project={project} />
    </>
  )
}
