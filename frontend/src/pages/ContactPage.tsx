import { useState } from 'react'
import { motion } from 'framer-motion'
import { submitContactForm } from '@services/api'
import { NNCard } from '@components/ui/NNCard'
import { NNButton } from '@components/ui/NNButton'
import { NNInput, NNTextarea } from '@components/ui/NNInput'
import { SOCIAL_LINKS } from '@utils/constants'
import type { ContactForm } from '@/types'

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitContactForm(formData)
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Failed to submit form:', error)
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 lg:px-16 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="nn-label text-nn-tertiary mb-4">Collaboration</p>
        <h1 className="nn-display text-nn-on-surface mb-6">
          Start a <span className="nn-gradient-text">Conversation</span>
        </h1>
        <p className="text-nn-on-surface-variant text-lg max-w-3xl mb-16">
          Have an AI project in mind or want to explore collaboration opportunities? Let's connect.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <NNCard className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-nn-on-surface mb-2">
                    Name
                  </label>
                  <NNInput
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-nn-on-surface mb-2">
                    Email
                  </label>
                  <NNInput
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-nn-on-surface mb-2">
                  Subject
                </label>
                <NNInput
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-nn-on-surface mb-2">
                  Message
                </label>
                <NNTextarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell me about your project..."
                />
              </div>

              <NNButton type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </NNButton>

              {status === 'success' && (
                <p className="text-green-400 text-center text-sm">Message sent successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-nn-error text-center text-sm">Failed to send. Please try again.</p>
              )}
            </form>
          </NNCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <NNCard className="p-6">
            <p className="nn-label text-nn-tertiary mb-3">Email</p>
            <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-nn-primary hover:underline">
              {SOCIAL_LINKS.email}
            </a>
          </NNCard>

          <NNCard className="p-6">
            <p className="nn-label text-nn-tertiary mb-3">GitHub</p>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-nn-primary hover:underline"
            >
              View Profile
            </a>
          </NNCard>

          <NNCard className="p-6">
            <p className="nn-label text-nn-tertiary mb-3">Blog</p>
            <a
              href={SOCIAL_LINKS.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="text-nn-primary hover:underline"
            >
              Read Articles
            </a>
          </NNCard>
        </div>
      </div>
    </div>
  )
}
