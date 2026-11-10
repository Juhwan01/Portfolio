import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import Markdown from './Markdown'
import { NotFoundPage } from './SiteLayout'
import { findPost, fmtDate, profile } from './content'

export default function PostPage() {
  const { id = '' } = useParams()
  const post = findPost(id)
  if (!post) return <NotFoundPage />
  return (
    <>
      <Helmet>
        <title>{`${post.title} — ${profile.name}`}</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      <section className="page-hero dark">
        <div className="wrap">
          <Link to="/#writing" className="back">
            ← 글 목록
          </Link>
          <p className="mono eyebrow">
            {fmtDate(post.published_at)}
            {post.read_time && ` · ${post.read_time}분 읽기`}
          </p>
          <h1>{post.title}</h1>
          <p className="hero-lead">{post.excerpt}</p>
          {post.tags && (
            <ul className="focus-chips">
              {post.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <article className="section">
        <div className="wrap post-body">
          <Markdown source={post.body} />
        </div>
      </article>
    </>
  )
}
