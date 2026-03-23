import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getBlogPosts } from '@services/api'
import { formatDate, calculateReadTime } from '@utils/helpers'
import type { BlogPost } from '@/types'

const CATEGORIES = ['All', 'AI/ML', 'Engineering', 'Tutorial', 'Thoughts'] as const

const categoryFilterMap: Record<string, string> = {
  'All': 'all',
  'AI/ML': 'research',
  'Engineering': 'case-study',
  'Tutorial': 'tutorial',
  'Thoughts': 'review',
}

function FeaturedSkeleton() {
  return (
    <div className="h-[500px] rounded-xl bg-surface-container-low animate-pulse" />
  )
}

function ArticleSkeleton() {
  return (
    <div className="bg-surface-container-low rounded-xl p-6 flex gap-6 animate-pulse">
      <div className="w-1/3 aspect-square rounded-lg bg-surface-container-lowest flex-shrink-0" />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="h-3 w-16 bg-surface-container-highest rounded mb-4" />
          <div className="h-5 w-3/4 bg-surface-container-highest rounded mb-3" />
          <div className="h-4 w-full bg-surface-container-highest rounded mb-2" />
          <div className="h-4 w-2/3 bg-surface-container-highest rounded" />
        </div>
        <div className="flex justify-between mt-4">
          <div className="h-3 w-20 bg-surface-container-highest rounded" />
          <div className="h-3 w-16 bg-surface-container-highest rounded" />
        </div>
      </div>
    </div>
  )
}

function FeaturedArticle({ post }: { readonly post: BlogPost }) {
  return (
    <Link to={`/blog/${post.id}`}>
      <motion.section
        className="mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative group cursor-pointer overflow-hidden rounded-xl bg-surface-container-low h-[500px] flex flex-col justify-end p-10 neural-glow border border-outline-variant/5">
          <div className="absolute inset-0 z-0">
            {post.coverImage && (
              <img
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                src={post.coverImage}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-primary/30">
                Featured
              </span>
              <span className="text-on-surface-variant text-xs font-label tracking-widest uppercase">
                {formatDate(post.publishedAt)}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-on-surface-variant text-lg mb-8 line-clamp-2 font-light">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
                <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                {post.readTime ?? calculateReadTime(post.content)} min read
              </span>
              <div className="h-px w-12 bg-outline-variant/30" />
              <span className="text-primary font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Read Journal{' '}
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>
      </motion.section>
    </Link>
  )
}

function ArticleCard({ post, index }: { readonly post: BlogPost; readonly index: number }) {
  const categoryDisplay: Record<string, string> = {
    'research': 'AI/ML',
    'case-study': 'Engineering',
    'tutorial': 'Tutorial',
    'review': 'Thoughts',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/blog/${post.id}`}>
        <article className="group bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary/20 hover:bg-surface-container-high transition-all duration-300 p-6 flex gap-6">
          <div className="w-1/3 aspect-square rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-lowest">
            {post.coverImage && (
              <img
                alt={post.title}
                className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                src={post.coverImage}
              />
            )}
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">
                {categoryDisplay[post.category] ?? post.category}
              </span>
              <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-on-surface-variant text-sm line-clamp-2 font-light leading-relaxed">
                {post.excerpt}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-outline uppercase tracking-widest font-bold">
              <span>{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">timer</span>
                {post.readTime ?? calculateReadTime(post.content)} min read
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">
        article
      </span>
      <p className="text-on-surface-variant text-lg mb-2">No posts found</p>
      <p className="text-outline text-sm">
        Try selecting a different category or check back later.
      </p>
    </div>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState<readonly BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    getBlogPosts()
      .then((data) => setPosts(data))
      .catch((err) => console.error('Failed to fetch blog posts:', err))
      .finally(() => setLoading(false))
  }, [])

  const filterValue = categoryFilterMap[activeCategory] ?? 'all'
  const filtered = filterValue === 'all'
    ? posts
    : posts.filter((p) => p.category === filterValue)

  const featuredPost = filtered[0] ?? null
  const gridPosts = filtered.slice(1, visibleCount + 1)
  const hasMore = filtered.length > visibleCount + 1

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6)
  }

  return (
    <div className="min-h-screen">
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
        {/* Hero Title */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-on-surface mb-4">
            Neural Log: <span className="text-primary-dim">Engineering Journal</span>
          </h1>
          <p className="text-on-surface-variant text-xl max-w-2xl font-light leading-relaxed">
            Insights into architectural logic, latent spaces, and production-ready intelligence. By Jung Juhwan.
          </p>
        </motion.section>

        {/* Featured Article */}
        {loading ? (
          <div className="mb-20">
            <FeaturedSkeleton />
          </div>
        ) : (
          featuredPost && <FeaturedArticle post={featuredPost} />
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 items-center">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category)
                setVisibleCount(6)
              }}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${
                activeCategory === category
                  ? 'bg-[#3713ec] text-on-primary-fixed'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        {loading ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }, (_, i) => (
              <ArticleSkeleton key={i} />
            ))}
          </section>
        ) : gridPosts.length === 0 && !featuredPost ? (
          <EmptyState />
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gridPosts.map((post, i) => (
              <ArticleCard key={post.id} post={post} index={i} />
            ))}
          </section>
        )}

        {/* Load More */}
        {!loading && hasMore && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-10 py-3 border border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant transition-all font-bold tracking-widest uppercase text-xs rounded-md"
            >
              Load More Entries
            </button>
          </div>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="bg-surface-container-low py-24 border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Subscribe to the <span className="text-primary">Intelligence Feed</span>
            </h2>
            <p className="text-on-surface-variant text-lg font-light">
              Deeply technical updates on AI infrastructure and architectural patterns, delivered once a month.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-md px-6 py-4 focus:outline-none focus:border-primary/50 text-on-surface font-body transition-all placeholder:text-outline/50"
                placeholder="engineer@research.lab"
                type="email"
              />
            </div>
            <button className="bg-primary-dim hover:bg-primary text-on-primary-fixed font-black px-10 py-4 rounded-md transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(102,91,255,0.2)]">
              Join
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
