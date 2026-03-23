import { useEffect, useState } from 'react'
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, type BlogPostCreateData } from '@services/api'
import type { BlogPost } from '@/types'
import Button from '@components/common/Button'
import MarkdownEditor from '@components/admin/MarkdownEditor'

const CATEGORIES = ['research', 'tutorial', 'case-study', 'review']

const emptyForm: BlogPostCreateData = {
  id: '',
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  tags: [],
  category: 'tutorial',
  read_time: 5,
}

const BlogAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<BlogPostCreateData>(emptyForm)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchPosts = async () => {
    try {
      const data = await getBlogPosts()
      setPosts(data)
    } catch (err) {
      console.error('Failed to fetch blog posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, id: crypto.randomUUID().replace(/-/g, '').slice(0, 16) })
    setCreating(true)
  }

  const openEdit = (post: BlogPost) => {
    setCreating(false)
    setEditing(post)
    setForm({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.coverImage,
      tags: post.tags,
      category: post.category,
      read_time: post.readTime,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) {
        await updateBlogPost(editing.id, form)
      } else {
        await createBlogPost(form)
      }
      setEditing(null)
      setCreating(false)
      setForm(emptyForm)
      fetchPosts()
    } catch (err) {
      console.error('Failed to save blog post:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    try {
      await deleteBlogPost(id)
      fetchPosts()
    } catch (err) {
      console.error('Failed to delete blog post:', err)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })
  }

  const inputClass = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition text-white'

  if (creating || editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{editing ? 'Edit Post' : 'New Post'}</h1>
          <Button variant="ghost" onClick={() => { setCreating(false); setEditing(null) }}>
            Cancel
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className={inputClass}
              placeholder="Brief summary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`${inputClass} bg-gray-800`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Read Time (min)</label>
              <input
                type="number"
                value={form.read_time}
                onChange={(e) => setForm({ ...form, read_time: parseInt(e.target.value) || 1 })}
                className={inputClass}
                min={1}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
            <input
              type="url"
              value={form.cover_image}
              onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className={inputClass}
                placeholder="Add tag"
              />
              <Button type="button" variant="secondary" onClick={addTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400">×</button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content (Markdown)</label>
            <MarkdownEditor
              value={form.content}
              onChange={(val) => setForm({ ...form, content: val })}
              height={500}
            />
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => { setCreating(false); setEditing(null) }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button onClick={openCreate}>New Post</Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No blog posts yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Tags</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">{post.title}</td>
                  <td className="py-3 px-4 text-gray-400">{post.category}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {post.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-white/5 rounded">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openEdit(post)} className="text-blue-400 hover:underline mr-4">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BlogAdmin
