import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getBlogPostById } from '@services/api'
import type { BlogPost as BlogPostType } from '@/types'
import Navbar from '@components/common/Navbar'
import Footer from '@components/common/Footer'
import { formatDate } from '@utils/helpers'

const BlogPost = () => {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      try {
        const data = await getBlogPostById(id)
        setPost(data)
      } catch (error) {
        console.error('Failed to fetch blog post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Post not found</div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <Navbar />
      <main className="min-h-screen pt-24 px-4 md:px-8 lg:px-16">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <time>{formatDate(post.publishedAt)}</time>
              <span>•</span>
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm glass rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-lg mb-8"
          />

          <div className="prose prose-invert prose-lg max-w-none">
            {post.content}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export default BlogPost
