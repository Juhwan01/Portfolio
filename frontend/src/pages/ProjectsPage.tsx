import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProjects } from '@services/api'
import { PROJECT_CATEGORIES, CATEGORY_LABELS } from '@utils/constants'
import SEO from '@components/common/SEO'
import type { Project } from '@/types'

const ICON_MAP: Record<string, string> = {
  AI: 'psychology',
  Web: 'language',
  Backend: 'dns',
  Mobile: 'phone_iphone',
  DevOps: 'cloud',
  Data: 'analytics',
  Other: 'layers',
}

function getProjectYear(project: Project): string {
  if (project.startDate) {
    return new Date(project.startDate).getFullYear().toString()
  }
  return new Date(project.createdAt).getFullYear().toString()
}

function TechBadge({ tech }: { tech: string }) {
  return (
    <span className="font-label text-[10px] text-outline px-2 py-1 border border-outline-variant/30 rounded uppercase tracking-tighter">
      {tech}
    </span>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-8 rounded-xl bg-surface-container-low animate-pulse min-h-[500px]" />
      <div className="md:col-span-4 rounded-xl bg-surface-container-high animate-pulse min-h-[300px]" />
      <div className="md:col-span-4 rounded-xl bg-surface-container-high animate-pulse min-h-[300px]" />
      <div className="md:col-span-8 rounded-xl bg-surface-container-low animate-pulse min-h-[250px]" />
      <div className="md:col-span-12 rounded-xl bg-surface-container-lowest animate-pulse min-h-[200px]" />
    </div>
  )
}

function FeaturedCard({ project }: { project: Project }) {
  const year = getProjectYear(project)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="md:col-span-8 group relative overflow-hidden bg-surface-container-low rounded-xl flex flex-col justify-end p-8 min-h-[500px] border border-outline-variant/10"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-dim/20 to-secondary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          {project.category && (
            <span className="font-label text-xs text-secondary font-bold tracking-widest px-3 py-1 bg-secondary/10 rounded-full border border-secondary/20">
              {CATEGORY_LABELS[project.category] ?? project.category}
            </span>
          )}
          <span className="font-label text-xs text-on-surface-variant tracking-widest">{year}</span>
        </div>
        <h3 className="text-4xl font-headline font-extrabold text-on-surface mb-4">
          {project.title}
        </h3>
        <p className="text-on-surface-variant max-w-xl mb-6 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-3">
          {project.techStack.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>
      </div>
      <Link
        to={`/projects/${project.id}`}
        className="absolute top-8 right-8 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-secondary hover:bg-secondary hover:text-on-primary transition-all"
      >
        <span className="material-symbols-outlined">north_east</span>
      </Link>
    </motion.article>
  )
}

function MediumCard({ project, index }: { project: Project; index: number }) {
  const year = getProjectYear(project)
  const icon = ICON_MAP[project.category ?? ''] ?? 'layers'

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="md:col-span-4 bg-surface-container-high rounded-xl p-8 border border-outline-variant/10 flex flex-col group hover:bg-surface-bright transition-all"
    >
      <Link to={`/projects/${project.id}`} className="flex flex-col h-full">
        {project.thumbnailUrl ? (
          <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-surface-container-lowest">
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex justify-between items-start mb-6">
            <span className="material-symbols-outlined text-4xl text-secondary">{icon}</span>
            <span className="font-label text-xs text-on-surface-variant tracking-widest">{year}</span>
          </div>
        )}
        <div className="mt-auto">
          {project.category && (
            <span className="font-label text-xs text-secondary font-bold tracking-widest mb-2 block">
              {(CATEGORY_LABELS[project.category] ?? project.category).toUpperCase()}
            </span>
          )}
          <h3 className="text-2xl font-headline font-bold text-on-surface mb-4 group-hover:text-secondary transition-colors">
            {project.title}
          </h3>
          <p className="text-on-surface-variant text-sm mb-6 leading-relaxed line-clamp-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 3).map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
            {project.techStack.length > 3 && (
              <span className="font-label text-[10px] text-outline px-2 py-1">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

function WideImageCard({ project, index }: { project: Project; index: number }) {
  const year = getProjectYear(project)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="md:col-span-8 group relative overflow-hidden bg-surface-container-low rounded-xl flex flex-col justify-end p-8 border border-outline-variant/10"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-dim/10 to-secondary/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>
      <div className="relative z-10 md:w-2/3">
        <div className="flex items-center gap-4 mb-4">
          {project.category && (
            <span className="font-label text-xs text-secondary font-bold tracking-widest px-3 py-1 bg-secondary/10 rounded-full border border-secondary/20">
              {(CATEGORY_LABELS[project.category] ?? project.category).toUpperCase()}
            </span>
          )}
          <span className="font-label text-xs text-on-surface-variant tracking-widest">{year}</span>
        </div>
        <h3 className="text-3xl font-headline font-extrabold text-on-surface mb-4">
          {project.title}
        </h3>
        <p className="text-on-surface-variant mb-6 leading-relaxed line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-3">
          {project.techStack.slice(0, 4).map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>
      </div>
      <Link
        to={`/projects/${project.id}`}
        className="absolute top-8 right-8 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-secondary hover:bg-secondary hover:text-on-primary transition-all"
      >
        <span className="material-symbols-outlined">north_east</span>
      </Link>
    </motion.article>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleArchiveCount, setVisibleArchiveCount] = useState(5)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const categories = ['All', ...PROJECT_CATEGORIES]

  const filtered = projects.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredProject = filtered[0] ?? null
  const secondProject = filtered[1] ?? null
  const thirdProject = filtered[2] ?? null
  const fourthProject = filtered[3] ?? null
  const remainingProjects = filtered.slice(4, 4 + visibleArchiveCount)
  const hasMoreArchive = filtered.length > 4 + visibleArchiveCount

  const handleLoadMore = () => {
    setVisibleArchiveCount((prev) => prev + 5)
  }

  return (
    <div className="mesh-bg min-h-screen">
      <SEO
        title="Projects"
        description="AI, 웹, 백엔드 등 다양한 프로젝트를 확인하세요. React, FastAPI, PyTorch 기반 프로젝트 모음."
        path="/projects"
      />
      <main className="pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter leading-none text-on-surface mb-6">
                <span className="text-gradient">프로젝트</span>
              </h1>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-lg font-light leading-relaxed">
                AI/ML, 웹 서비스, 백엔드 등 다양한 프로젝트를 소개합니다.
              </p>
            </div>
            <div className="hidden lg:block w-32 h-32 border-l border-t border-outline-variant/30 opacity-50 relative">
              <div className="absolute top-0 right-0 w-4 h-4 bg-secondary" />
            </div>
          </div>
        </motion.section>

        {/* Filters */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-16"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            const label = cat === 'All' ? '전체' : (CATEGORY_LABELS[cat] ?? cat)
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setVisibleArchiveCount(5)
                }}
                className={`font-label px-6 py-2 rounded-full text-sm font-bold uppercase transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-bright border border-outline-variant/20'
                }`}
              >
                {label}
              </button>
            )
          })}
          <div className="flex-grow" />
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-sm">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="프로젝트 검색..."
              className="bg-surface-container-lowest border-none border-b-2 border-transparent focus:ring-0 focus:border-secondary transition-all font-label text-xs tracking-widest pl-10 pr-6 py-3 rounded-full w-64 placeholder:text-outline-variant text-on-surface"
            />
          </div>
        </motion.nav>

        {/* Bento Archive Grid */}
        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 block text-outline-variant/50">
              search_off
            </span>
            <p className="text-lg">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Featured Card (1st project) */}
            {featuredProject && <FeaturedCard project={featuredProject} />}

            {/* Medium Card (2nd project) - right side of featured */}
            {secondProject && <MediumCard project={secondProject} index={1} />}

            {/* Medium Card (3rd project) */}
            {thirdProject && <MediumCard project={thirdProject} index={2} />}

            {/* Wide Image Card (4th project) */}
            {fourthProject && <WideImageCard project={fourthProject} index={3} />}

            {/* 나머지 프로젝트 카드 */}
            {remainingProjects.map((project, i) => (
              <MediumCard key={project.id} project={project} index={i + 4} />
            ))}
          </div>
        )}

        {/* Load More Section */}
        {!loading && hasMoreArchive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 flex flex-col items-center gap-6"
          >
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-secondary to-transparent" />
            <button
              onClick={handleLoadMore}
              className="group flex items-center gap-3 font-label text-sm tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
            >
              더 보기
              <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">
                keyboard_double_arrow_down
              </span>
            </button>
          </motion.div>
        )}
      </main>
    </div>
  )
}
