import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { featuredProjects, fmtMonth, fmtPeriod, otherProjects, profile } from './content'
import type { Project } from './types'

function SectionHead({ id, title, note }: { readonly id?: string; readonly title: string; readonly note?: string }) {
  return (
    <div className="section-head">
      <h2 id={id}>{title}</h2>
      {note && <span className="mono muted">{note}</span>}
    </div>
  )
}

function WorkRow({ project, index }: { readonly project: Project; readonly index: number }) {
  const metric = project.metrics?.[0]
  return (
    <li className="work-row">
      <Link to={`/projects/${project.slug}`}>
        <span className="num mono">{String(index + 1).padStart(2, '0')}</span>
        <div className="work-text">
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <p className="meta mono">
            {fmtPeriod(project.period)}
            {project.org && ` · ${project.org}`}
          </p>
          {(metric || project.awards?.length) && (
            <p className="work-proof">
              {metric && (
                <span className="metric">
                  <strong>{metric.value}</strong> {metric.label}
                </span>
              )}
              {project.awards?.map((a) => (
                <span key={a} className="award">
                  {a}
                </span>
              ))}
            </p>
          )}
        </div>
        {project.cover && (
          <div className="thumb">
            <img src={project.cover} alt="" loading="lazy" />
          </div>
        )}
      </Link>
    </li>
  )
}

export default function HomePage() {
  const { links } = profile
  return (
    <>
      <Helmet>
        <title>{`${profile.name} — ${profile.current.role}`}</title>
      </Helmet>

      <section className="intro">
        <div className="wrap">
          <p className="eyebrow mono">
            {profile.current.role} · {profile.current.org}
          </p>
          <h1>{profile.name}</h1>
          <p className="headline">{profile.headline}</p>
          <p className="lead">{profile.intro}</p>
          <p className="focus mono">{profile.focus}</p>
          <div className="links-inline">
            <a href={links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            {links.blog && (
              <a href={links.blog} target="_blank" rel="noreferrer">
                Blog
              </a>
            )}
            <a href={`mailto:${links.email}`}>{links.email}</a>
          </div>
          <ul className="proof" aria-label="주요 성과">
            {profile.highlights.map((h) => (
              <li key={h.text}>{h.project ? <Link to={`/projects/${h.project}`}>{h.text}</Link> : h.text}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="work">
        <div className="wrap">
          <SectionHead id="work" title="선택한 작업" note={`${featuredProjects.length}`} />
          <ol className="work-list">
            {featuredProjects.map((p, i) => (
              <WorkRow key={p.slug} project={p} index={i} />
            ))}
          </ol>

          <h3 className="sub-head">그 밖의 프로젝트</h3>
          <ul className="other-list">
            {otherProjects.map((p) => (
              <li key={p.slug}>
                <Link to={`/projects/${p.slug}`}>
                  <span className="other-title">{p.title}</span>
                  <span className="other-summary">{p.summary}</span>
                  <span className="mono muted">{fmtMonth(p.period.start).slice(0, 4)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="field">
        <div className="wrap">
          <SectionHead id="field" title="현장" />
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
                  <a href={a.links.event} target="_blank" rel="noreferrer">
                    행사 소개
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

      <section className="section" aria-labelledby="experience">
        <div className="wrap">
          <SectionHead id="experience" title="경력" />
          <ol className="timeline">
            {profile.experience.map((e) => (
              <li key={e.org}>
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
    </>
  )
}
