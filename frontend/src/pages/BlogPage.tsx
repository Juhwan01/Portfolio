import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getBlogPosts } from '@services/api'
import { NNCard } from '@components/ui/NNCard'
import { NNBadge } from '@components/ui/NNBadge'
import type { BlogPost } from '@/types'

const categoryLabels: Record<string, string> = {
  research: 'Research',
  tutorial: 'Tutorial',
  'case-study': 'Case Study',
  review: 'Review',
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch((err) => console.error('Failed to fetch blog posts:', err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeFilter === 'all'
    ? posts
    : posts.filter((p) => p.category === activeFilter)

  const filters = ['all', 'research', 'tutorial', 'case-study', 'review']

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="nn-label text-nn-tertiary mb-4">Engineering Journal</p>
        <h1 className="nn-display text-nn-on-surface mb-6">Neural Log</h1>
        <p className="text-nn-on-surface-variant text-lg max-w-3xl mb-12">
          Insights, tutorials, and deep dives into AI engineering.
        </p>
      </motion.div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-[4px] text-sm font-medium transition-all capitalize ${
              activeFilter === f
                ? 'nn-gradient-primary text-black'
                : 'bg-nn-surface-highest text-nn-on-surface-variant hover:text-nn-on-surface'
            }`}
          >
            {f === 'all' ? 'All' : categoryLabels[f] || f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 rounded-xl bg-nn-surface-low animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-nn-on-surface-variant">
          No blog posts yet. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/blog/${post.id}`}>
                <NNCard className="overflow-hidden group h-full">
                  {post.coverImage && (
                    <div className="relative aspect-[2/1] overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-nn-bg/80 via-transparent to-transparent" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <NNBadge variant="accent">{categoryLabels[post.category] || post.category}</NNBadge>
                      <span className="text-nn-on-surface-variant text-xs">
                        {post.readTime} min read
                      </span>
                    </div>
                    <h3 className="text-nn-on-surface font-semibold text-lg mb-2 group-hover:text-nn-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-nn-on-surface-variant text-sm line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <NNBadge key={tag}>{tag}</NNBadge>
                      ))}
                    </div>
                  </div>
                </NNCard>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
