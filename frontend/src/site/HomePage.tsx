import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  featuredProjects,
  fmtDate,
  fmtMonth,
  fmtPeriod,
  otherProjects,
  profile,
  shortTitle,
  skillGroups,
  sortedPosts,
} from './content'
import { CoverFrame, Emphasis, accentStyle } from './parts'
import type { Project } from './types'

function SectionHead({
  id,
  index,
  title,
  note,
  children,
}: {
  readonly id: string
  readonly index: string
  readonly title: string
  readonly note?: string
  readonly children?: ReactNode
}) {
  return (
    <div className="section-head">
      <span className="section-index mono">{index}</span>
      <h2 id={id}>{title}</h2>
      {note && <p className="section-note">{note}</p>}
      {children}
    </div>
  )
}

function Hero() {
  const { links, current } = profile
  return (
    <section className="hero dark">
      <div className="wrap">
        <p className="eyebrow mono">
          <span className="live-dot" aria-hidden="true" />
          {profile.name} · {current.role} @ {current.org}
        </p>
        <h1>
          <Emphasis text={profile.headline} />
        </h1>
        <p className="hero-lead">{profile.intro}</p>
        <ul className="focus-chips" aria-label="주력 분야">
          {profile.focus.split(' · ').map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="link-buttons">
          <a href={`mailto:${links.email}`} className="primary">
            메일 보내기
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
        <ul className="stats" aria-label="주요 성과">
          {profile.highlights.map((h) => {
            const inner = (
              <>
                <strong>{h.value}</strong>
                <span>{h.label}</span>
              </>
            )
            return <li key={h.value}>{h.project ? <Link to={`/projects/${h.project}`}>{inner}</Link> : inner}</li>
          })}
        </ul>
      </div>
    </section>
  )
}

/** The shipped app gets a dark panel with its screens. */
function FlagshipCard({ project }: { readonly project: Project }) {
  const product = project.product!
  const phones = product.features.filter((f) => f.mine).slice(0, 2)
  return (
    <Link to={`/projects/${project.slug}`} className="flagship dark" style={accentStyle(project)}>
      <div className="flagship-text">
        <div className="app-id">
          {product.icon && <img src={product.icon} alt="" />}
          <div>
            <strong>{project.title}</strong>
            <span className="mono">
              {project.org} · {fmtPeriod(project.period)}
            </span>
          </div>
        </div>
        <p className="flagship-summary">{project.summary}</p>
        {project.metrics && (
          <ul className="flagship-metrics">
            {project.metrics.slice(0, 3).map((m) => (
              <li key={m.label}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </li>
            ))}
          </ul>
        )}
        <span className="more">케이스 스터디 보기 →</span>
      </div>
      <div className="phones" aria-hidden="true">
        {phones.map((f) => (
          <img key={f.image} src={f.image} alt="" className="phone" loading="lazy" />
        ))}
      </div>
    </Link>
  )
}

function WorkCard({ project }: { readonly project: Project }) {
  const metric = project.metrics?.[0]
  const award = project.awards?.[0]
  return (
    <li>
      <Link to={`/projects/${project.slug}`} className="work-card">
        <CoverFrame project={project} />
        <div className="work-card-body">
          <p className="meta mono">
            {fmtPeriod(project.period)}
            {project.org && ` · ${project.org}`}
          </p>
          <h3>{project.title}</h3>
          <p className="work-summary">{project.summary}</p>
          {(award || (metric && project.cover)) && (
            <p className="work-proof">
              {award ? (
                <span className="award">{award}</span>
              ) : (
                <span>
                  <strong>{metric!.value}</strong> {metric!.label}
                </span>
              )}
            </p>
          )}
          {project.tags && (
            <ul className="tags">
              {project.tags.slice(0, 4).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </li>
  )
}

function Work() {
  const [flagship, ...rest] = featuredProjects
  const hasFlagship = Boolean(flagship?.product)
  return (
    <section className="section" aria-labelledby="work">
      <div className="wrap">
        <SectionHead id="work" index="01" title="선택한 작업" note="출시한 서비스와 수상·입상한 프로젝트" />
        {hasFlagship && <FlagshipCard project={flagship} />}
        <ul className="work-grid">
          {(hasFlagship ? rest : featuredProjects).map((p) => (
            <WorkCard key={p.slug} project={p} />
          ))}
        </ul>

        <h3 className="sub-head">그 밖의 프로젝트</h3>
        <ul className="other-grid">
          {otherProjects.map((p) => (
            <li key={p.slug}>
              <Link to={`/projects/${p.slug}`} className="other-card">
                <CoverFrame project={p} size="small" />
                <div>
                  <span className="other-title">{p.title}</span>
                  <span className="other-summary">{p.summary}</span>
                  <span className="mono muted">
                    {fmtMonth(p.period.start).slice(0, 4)}
                    {p.category && ` · ${p.category}`}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Stack() {
  return (
    <section className="section tinted" aria-labelledby="stack">
      <div className="wrap">
        <SectionHead id="stack" index="02" title="기술" note="이름 아래는 그 기술을 실제로 쓴 프로젝트입니다." />
        <div className="stack-grid">
          {skillGroups.map((g) => (
            <div key={g.name} className="stack-group">
              <h3>{g.name}</h3>
              <ul>
                {g.items.map((s) => (
                  <li key={s.name}>
                    <span className="skill-name">
                      {s.name}
                      {s.note && <span className="skill-note">{s.note}</span>}
                    </span>
                    {s.projects.length > 0 && (
                      <span className="skill-used">
                        {s.projects.slice(0, 3).map((p, i) => (
                          <span key={p.slug}>
                            {i > 0 && ' · '}
                            <Link to={`/projects/${p.slug}`}>{shortTitle(p)}</Link>
                          </span>
                        ))}
                        {s.projects.length > 3 && <span className="muted"> +{s.projects.length - 3}</span>}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Field() {
  return (
    <section className="section" aria-labelledby="field">
      <div className="wrap">
        <SectionHead id="field" index="03" title="현장" />
        {profile.activities.map((a) => (
          <article key={a.title} className="activity">
            <div className="activity-text">
              <p className="mono muted">
                {a.date_detail ?? fmtPeriod(a.period)}
                {a.place && ` · ${a.place}`}
              </p>
              <h3>{a.title}</h3>
              <p>{a.summary}</p>
              {a.org && <p className="muted">{a.org}</p>}
              {a.links?.event && (
                <a href={a.links.event} target="_blank" rel="noreferrer" className="text-link">
                  행사 소개 →
                </a>
              )}
            </div>
            {a.photos && (
              <div className="photo-grid">
                {a.photos.map((src, i) => (
                  <img key={src} src={src} alt={`${a.title} 사진 ${i + 1}`} loading="lazy" />
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function Writing() {
  if (!sortedPosts.length) return null
  return (
    <section className="section" aria-labelledby="writing">
      <div className="wrap">
        <SectionHead id="writing" index="04" title="글">
          {profile.links.blog && (
            <a href={profile.links.blog} target="_blank" rel="noreferrer" className="text-link head-link">
              블로그 전체 보기 →
            </a>
          )}
        </SectionHead>
        <ul className="post-list">
          {sortedPosts.map((post) => (
            <li key={post.id}>
              <Link to={`/blog/${post.id}`} className="post-card">
                <p className="mono muted">
                  {fmtDate(post.published_at)}
                  {post.read_time && ` · ${post.read_time}분`}
                </p>
                <h3>{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                {post.tags && (
                  <ul className="tags">
                    {post.tags.slice(0, 4).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section className="section" aria-labelledby="experience">
      <div className="wrap">
        <SectionHead id="experience" index="05" title="경력" />
        <ol className="timeline">
          {profile.experience.map((e) => (
            <li key={e.org} className={e.period.end ? undefined : 'current'}>
              <span className="mono muted">{fmtPeriod(e.period)}</span>
              <div>
                <h3>
                  {e.org} <span className="role">{e.role}</span>
                </h3>
                {e.points && (
                  <ul>
                    {e.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
          {profile.education.map((e) => (
            <li key={e.org}>
              <span className="mono muted">{fmtPeriod(e.period)}</span>
              <div>
                <h3>
                  {e.org} <span className="role">{e.degree}</span>
                </h3>
                {e.note && <p className="muted">{e.note}</p>}
              </div>
            </li>
          ))}
        </ol>

        <div className="recognition">
          <div>
            <h3 className="sub-head">수상 · 대회</h3>
            <ul className="dated-list">
              {[...profile.awards, ...profile.competitions]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((a) => (
                  <li key={a.title}>
                    <span className="mono muted">{fmtMonth(a.date)}</span>
                    {a.project ? <Link to={`/projects/${a.project}`}>{a.title}</Link> : <span>{a.title}</span>}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h3 className="sub-head">오픈소스</h3>
            <ul className="dated-list">
              {profile.open_source.map((o) => (
                <li key={o.title}>
                  {o.project ? <Link to={`/projects/${o.project}`}>{o.title}</Link> : <span>{o.title}</span>}
                  <span className="muted">{o.note}</span>
                </li>
              ))}
            </ul>
          </div>
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
      <Hero />
      <Work />
      <Stack />
      <Field />
      <Writing />
      <Experience />
    </>
  )
}
