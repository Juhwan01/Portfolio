/* Blog list and post layouts adapted from the Magic UI portfolio template (MIT) — see THIRD_PARTY.md. */
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import Markdown from './Markdown'
import { BackLink, Divider, PrevNext } from './ProjectPage'
import { NotFoundPage } from './SiteLayout'
import { findPost, fmtDate, postNeighbors, profile, sortedPosts } from './content'
import { BLUR_FADE_DELAY, BlurFade, Icons } from './ui'

const D = BLUR_FADE_DELAY

export function BlogPage() {
  return (
    <section id="blog">
      <Helmet>
        <title>{`글 | ${profile.name}`}</title>
      </Helmet>
      <BackLink to="/#writing" label="홈" />
      <BlurFade delay={D}>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          글{' '}
          <span className="ml-1 bg-card border border-border rounded-md px-2 py-1 text-muted-foreground text-sm">
            {sortedPosts.length}편
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          모델 출시와 연구, 추론 속도와 가격의 변화가 LLM 서비스 구조에서 무엇을 바꾸는지 따져 본 글입니다.
          {profile.links.blog && (
            <>
              {' '}
              더 많은 글은{' '}
              <a href={profile.links.blog} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">
                velog
              </a>
              에 있습니다.
            </>
          )}
        </p>
      </BlurFade>
      <div className="flex flex-col gap-5">
        {sortedPosts.map((post, i) => (
          <BlurFade key={post.id} delay={D * 3 + i * 0.05}>
            <Link to={`/blog/${post.id}`} className="flex items-start gap-x-2 group cursor-pointer">
              <span className="text-xs font-mono tabular-nums font-medium mt-[5px]">{String(i + 1).padStart(2, '0')}.</span>
              <div className="flex flex-col gap-y-2 flex-1">
                <p className="tracking-tight text-lg font-medium">
                  {post.title}
                  <Icons.chevronRight className="ml-1 inline-block size-4 [stroke-width:3] text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                </p>
                <p className="text-xs text-muted-foreground">{fmtDate(post.published_at)}</p>
              </div>
            </Link>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}

export default function PostPage() {
  const { id = '' } = useParams()
  const post = findPost(id)
  if (!post) return <NotFoundPage />
  const { prev, next } = postNeighbors(post.id)
  return (
    <section id="post">
      <Helmet>
        <title>{`${post.title} | ${profile.name}`}</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      <BackLink to="/blog" label="글 목록" />
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-3xl md:text-4xl tracking-tighter leading-tight">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {fmtDate(post.published_at)}
          {post.read_time && ` · ${post.read_time}분 읽기`}
        </p>
      </div>
      <Divider />
      <Markdown source={post.body} />
      <PrevNext
        prev={prev && { title: prev.title, to: `/blog/${prev.id}` }}
        next={next && { title: next.title, to: `/blog/${next.id}` }}
      />
    </section>
  )
}
