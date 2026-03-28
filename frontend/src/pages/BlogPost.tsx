import { useParams, Link } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getBlogPostById } from '@services/api'
import MarkdownRenderer from '@components/content/MarkdownRenderer'
import TableOfContents from '@components/content/TableOfContents'
import { NNBadge } from '@components/ui/NNBadge'
import SEO from '@components/common/SEO'
import { formatDate } from '@utils/helpers'
import { extractHeadings } from '@/utils/markdown'
import { useScrollProgress } from '@hooks/useScrollAnimation'
import type { BlogPost as BlogPostType } from '@/types'

const categoryLabels: Record<string, string> = {
  research: 'Research',
  tutorial: 'Tutorial',
  'case-study': 'Case Study',
  review: 'Review',
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [loading, setLoading] = useState(true)
  const scrollProgress = useScrollProgress()

  const headings = useMemo(
    () => (post ? extractHeadings(post.content) : []),
    [post]
  )

  useEffect(() => {
    if (!id) return
    getBlogPostById(id)
      .then(setPost)
      .catch((err) => console.error('Failed to fetch blog post:', err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-8 lg:px-16 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-nn-surface-low rounded w-20" />
          <div className="h-12 bg-nn-surface-low rounded w-3/4" />
          <div className="h-64 bg-nn-surface-low rounded-xl" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl text-nn-on-surface mb-4">Post not found</h2>
        <Link to="/blog" className="text-nn-primary hover:underline">Back to Blog</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-nn-primary-dim to-nn-primary z-[60] transition-[width] duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <SEO
        title={post.title}
        description={post.content?.slice(0, 160)}
        path={`/blog/${post.id}`}
        image={post.coverImage || undefined}
        type="article"
      />

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Hero Header */}
        <div className="relative overflow-hidden pt-24 pb-12 px-4 md:px-8 lg:px-16">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(102,91,255,0.1) 0%, transparent 60%)',
            }}
          />
          <header className="relative max-w-4xl mx-auto">
            <Link to="/blog" className="text-nn-on-surface-variant hover:text-nn-primary text-sm mb-6 inline-flex items-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <NNBadge variant="accent">{categoryLabels[post.category] || post.category}</NNBadge>
              <span className="text-nn-on-surface-variant text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-base">schedule</span>
                {post.readTime} min read
              </span>
            </div>
            <h1 className="nn-display text-nn-on-surface mb-4">{post.title}</h1>
            <p className="text-nn-on-surface-variant text-lg mb-4 max-w-2xl">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-nn-on-surface-variant">
              <time>{formatDate(post.publishedAt)}</time>
              <div className="h-px w-6 bg-nn-outline-variant/30" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <NNBadge key={tag}>{tag}</NNBadge>
                ))}
              </div>
            </div>
          </header>
        </div>

        {/* Cover Image */}
        <div className="px-4 md:px-8 lg:px-16 max-w-4xl mx-auto">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              className="w-full rounded-xl mb-10 max-h-[480px] object-cover"
            />
          )}
        </div>

        {/* Content + TOC */}
        <div className="px-4 md:px-8 lg:px-16 pb-20">
          <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
            <div className="max-w-3xl">
              <MarkdownRenderer content={post.content} />
            </div>
            <aside>
              <TableOfContents headings={headings} />
            </aside>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export default BlogPost
