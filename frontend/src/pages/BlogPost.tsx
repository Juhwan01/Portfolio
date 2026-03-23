import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getBlogPostById } from '@services/api'
import MarkdownRenderer from '@components/content/MarkdownRenderer'
import { NNBadge } from '@components/ui/NNBadge'
import { formatDate } from '@utils/helpers'
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
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 lg:px-16">
      <motion.article
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <header className="mb-10">
          <Link to="/blog" className="text-nn-on-surface-variant hover:text-nn-primary text-sm mb-4 inline-block transition-colors">
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <NNBadge variant="accent">{categoryLabels[post.category] || post.category}</NNBadge>
            <span className="text-nn-on-surface-variant text-sm">{post.readTime} min read</span>
          </div>
          <h1 className="nn-display text-nn-on-surface mb-4">{post.title}</h1>
          <p className="text-nn-on-surface-variant text-lg mb-4">{post.excerpt}</p>
          <time className="text-nn-on-surface-variant text-sm">{formatDate(post.publishedAt)}</time>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <NNBadge key={tag}>{tag}</NNBadge>
            ))}
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-xl mb-10 max-h-[480px] object-cover"
          />
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <MarkdownRenderer content={post.content} />
        </div>
      </motion.article>
    </div>
  )
}

export default BlogPost
