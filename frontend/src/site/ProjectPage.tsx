import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams } from 'react-router-dom'
import Markdown from './Markdown'
import { NotFoundPage } from './SiteLayout'
import { LINK_LABELS, findProject, fmtPeriod, isExternal } from './content'
import type { LinkKind, Metric, Project } from './types'

const LINK_ORDER: LinkKind[] = ['appstore', 'playstore', 'website', 'demo', 'github', 'slides', 'video']

function ProjectLinks({ project, primary }: { readonly project: Project; readonly primary?: LinkKind }) {
  const links = LINK_ORDER.filter((k) => project.links?.[k] && !(k === 'video' && !isExternal(project.links[k]!)))
  if (!links.length) return null
  return (
    <div className="link-buttons">
      {links.map((k) => (
        <a key={k} href={project.links![k]} target="_blank" rel="noreferrer" className={k === primary ? 'primary' : undefined}>
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

function LocalVideo({ project }: { readonly project: Project }) {
  const src = project.links?.video
  if (!src || isExternal(src)) return null
  return <video className="demo-video" src={src} controls preload="metadata" />
}

/** A shipped product: introduce the app first, then what I did and what changed. */
function ProductProject({ project }: { readonly project: Project }) {
  const product = project.product!
  const phones = product.features.filter((f) => f.mine).slice(0, 2)
  return (
    <>
      <section className="product">
        <div className="wrap">
          <Link to="/#work" className="back">
            ← 작업 목록
          </Link>
          <div className="product-hero">
            <div>
              <div className="app-id">
                {product.icon && <img src={product.icon} alt="" />}
                <div>
                  <strong>{product.name}</strong>
                  <span className="mono">
                    {project.org} · {fmtPeriod(project.period)}
                  </span>
                </div>
              </div>
              <h1>{product.tagline}</h1>
              <p className="about">{product.about}</p>
              <ProjectLinks project={project} primary="appstore" />
            </div>
            <div className="phones" aria-hidden="true">
              {phones.map((f) => (
                <img key={f.image} src={f.image} alt="" className="phone" />
              ))}
            </div>
          </div>

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
        </div>
      </section>

      <Block title="내가 맡은 일">
        <dl className="facts">
          <dt>역할</dt>
          <dd>{project.role}</dd>
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

      {project.metrics && (
        <Block title="성과">
          <Metrics metrics={project.metrics} />
        </Block>
      )}

      <Block title="자세히">
        <Markdown source={project.body} />
      </Block>

      <Block title="기술">
        <Tags tags={project.tags} />
      </Block>
    </>
  )
}

function PlainProject({ project }: { readonly project: Project }) {
  return (
    <div className="wrap">
      <Link to="/#work" className="back">
        ← 작업 목록
      </Link>
      <header className="project-head">
        <p className="mono muted">
          {fmtPeriod(project.period)}
          {project.org && ` · ${project.org}`}
        </p>
        <h1>{project.title}</h1>
        <p className="summary">{project.summary}</p>
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
          {project.awards?.map((a) => (
            <div key={a}>
              <dt>수상</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
        <ProjectLinks project={project} primary="demo" />
      </header>
      {project.metrics && <Metrics metrics={project.metrics} />}
      {project.cover && (
        <figure className="cover">
          <img src={project.cover} alt={`${project.title} 대표 이미지`} />
        </figure>
      )}
      <LocalVideo project={project} />
      <div className="plain-body">
        <Markdown source={project.body} />
        <Tags tags={project.tags} />
      </div>
    </div>
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
        <title>{`${project.title} — 정주환`}</title>
        <meta name="description" content={project.summary} />
      </Helmet>
      {project.product ? <ProductProject project={project} /> : <PlainProject project={project} />}
    </>
  )
}
