import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProjects } from '@services/api'
import { NNCard } from '@components/ui/NNCard'
import { NNBadge } from '@components/ui/NNBadge'
import type { Project } from '@/types'

const categories = ['All', 'AI', 'Web', 'Backend', 'Mobile', 'Data', 'DevOps']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

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

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="nn-label text-nn-tertiary mb-4">Project Archive</p>
        <h1 className="nn-display text-nn-on-surface mb-6">All Works</h1>
        <p className="text-nn-on-surface-variant text-lg max-w-3xl mb-12">
          A collection of projects spanning AI, web development, and data engineering.
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-[4px] text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'nn-gradient-primary text-black'
                : 'bg-nn-surface-highest text-nn-on-surface-variant hover:text-nn-on-surface'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[16/12] rounded-xl bg-nn-surface-low animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/projects/${project.id}`}>
                <NNCard className="overflow-hidden group h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-nn-surface-container to-nn-surface-highest flex items-center justify-center">
                        <span className="text-4xl text-nn-on-surface-variant/20">{project.title[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-nn-bg/80 via-transparent to-transparent" />
                    {project.status === 'in_progress' && (
                      <div className="absolute top-3 right-3">
                        <NNBadge variant="live">In Progress</NNBadge>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {project.category && <NNBadge variant="accent">{project.category}</NNBadge>}
                    </div>
                    <h3 className="text-nn-on-surface font-semibold text-lg mb-1">{project.title}</h3>
                    <p className="text-nn-on-surface-variant text-sm line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <NNBadge key={tech}>{tech}</NNBadge>
                      ))}
                      {project.techStack.length > 4 && (
                        <NNBadge>+{project.techStack.length - 4}</NNBadge>
                      )}
                    </div>
                  </div>
                </NNCard>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-nn-on-surface-variant">
          No projects found in this category.
        </div>
      )}
    </div>
  )
}
