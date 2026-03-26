import { useState } from 'react'
import { submitContactForm } from '@services/api'
import { SOCIAL_LINKS } from '@utils/constants'
import SEO from '@components/common/SEO'
import { toast } from '@components/common/Toast'
import type { ContactForm } from '@/types'

const SOCIAL_GRID = [
  {
    icon: 'code',
    name: 'GitHub',
    handle: '/Juhwan01',
    url: SOCIAL_LINKS.github,
  },
  {
    icon: 'article',
    name: 'Blog',
    handle: '@juhwan01',
    url: SOCIAL_LINKS.blog,
  },
  {
    icon: 'mail',
    name: 'Email',
    handle: SOCIAL_LINKS.email,
    url: `mailto:${SOCIAL_LINKS.email}`,
  },
] as const

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
      toast('메시지가 성공적으로 전송되었습니다!', 'success')
    } catch (error) {
      console.error('Failed to submit form:', error)
      setStatus('error')
      toast('전송에 실패했습니다. 다시 시도해 주세요.', 'error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="mesh-bg min-h-screen flex flex-col">
      <SEO
        title="Contact"
        description="프로젝트 협업, 채용 문의, 기술 상담 등 연락해 주세요."
        path="/contact"
      />
      <main className="flex-grow pt-32 pb-20 px-6 md:px-8 max-w-7xl mx-auto w-full">
        {/* Hero Statement */}
        <div className="mb-20">
          <h1 className="font-headline font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-tighter text-on-surface max-w-4xl leading-none">
            <span className="text-secondary">연락</span>하기
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Form */}
          <section className="lg:col-span-8 glass-card rounded-xl p-8 md:p-12">
            <div className="mb-10">
              <h2 className="font-headline font-bold text-3xl mb-2">메시지 보내기</h2>
              <p className="text-on-surface-variant font-body text-lg">
                프로젝트 협업, 채용 문의 등 편하게 연락해 주세요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="font-label text-xs tracking-widest text-outline mb-2 block">
                    이름
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 text-on-surface placeholder-outline-variant/50 py-4 transition-all duration-300"
                    placeholder="홍길동"
                  />
                </div>
                <div className="group">
                  <label className="font-label text-xs tracking-widest text-outline mb-2 block">
                    이메일
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 text-on-surface placeholder-outline-variant/50 py-4 transition-all duration-300"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="group">
                <label className="font-label text-xs tracking-widest text-outline mb-2 block">
                  메시지
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 text-on-surface placeholder-outline-variant/50 py-4 transition-all duration-300 resize-none"
                  placeholder="문의 내용을 작성해 주세요..."
                />
              </div>

              {status === 'success' && (
                <p className="text-secondary text-center text-sm font-label">
                  메시지가 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.
                </p>
              )}
              {status === 'error' && (
                <p className="text-error text-center text-sm font-label">
                  전송에 실패했습니다. 다시 시도해 주세요.
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">bolt</span>
                  <span className="font-label text-[10px] tracking-tighter text-outline">
                    응답 시간: 24시간 이내
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-gradient-to-r from-primary-container to-secondary-container text-on-primary px-10 py-4 rounded-full font-headline font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-primary-container/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? '전송 중...' : '보내기'}
                </button>
              </div>
            </form>
          </section>

          {/* Right: Links & CTA */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Collaboration CTA */}
            <div className="bg-primary-container rounded-xl p-8 text-on-primary shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                <span className="material-symbols-outlined text-9xl">auto_awesome</span>
              </div>
              <h3 className="font-headline font-black text-2xl tracking-tighter mb-2 relative z-10">
                협업 가능
              </h3>
              <p className="font-body text-sm mb-6 opacity-90 relative z-10">
                AI 시스템 설계, LLM 파이프라인, 백엔드/인프라 관련 프로젝트 협업이 가능합니다.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 font-label font-bold text-xs uppercase tracking-widest bg-on-primary text-primary px-4 py-2 rounded-full hover:bg-white hover:text-on-primary transition-colors relative z-10"
              >
                문의하기
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>

            {/* Social & Links Bento Card */}
            <div className="surface-container-high rounded-xl p-8 space-y-6">
              <h3 className="font-label text-xs uppercase tracking-[0.2em] text-outline mb-4">
                Network.Grid
              </h3>
              {SOCIAL_GRID.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg bg-surface-container-lowest hover:bg-surface-bright transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined">{link.icon}</span>
                    </div>
                    <div>
                      <p className="font-headline font-bold text-sm">{link.name}</p>
                      <p className="font-label text-[10px] text-outline">{link.handle}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                    arrow_outward
                  </span>
                </a>
              ))}
            </div>

            {/* Status Card */}
            <div className="surface-container-low border border-outline-variant/10 rounded-xl p-6 flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-secondary rounded-full animate-ping opacity-75" />
              </div>
              <div>
                <p className="font-label text-[10px] tracking-widest text-outline">
                  현재 상태
                </p>
                <p className="font-body font-bold text-on-surface">구직 중</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
