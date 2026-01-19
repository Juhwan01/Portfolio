import { useEffect, useState, useMemo } from 'react'
import { getProjects } from '@services/api'
import type { Project } from '@/types'
import ProjectCarousel from '@components/common/ProjectCarousel'
import { PROJECT_CATEGORIES, CATEGORY_LABELS } from '@/utils/constants'

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects({ featured: true })
        setProjects(data)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const projectsByCategory = useMemo(() => {
    const grouped: Record<string, Project[]> = {}

    PROJECT_CATEGORIES.forEach(category => {
      const categoryProjects = projects.filter(p => p.category === category)
      if (categoryProjects.length > 0) {
        grouped[category] = categoryProjects
      }
    })

    return grouped
  }, [projects])

  if (loading) {
    return (
      <section id="projects" className="section-container">
        <div className="text-center">Loading projects...</div>
      </section>
    )
  }

  const categories = Object.keys(projectsByCategory)

  return (
    <section id="projects" className="section-container">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Featured <span className="gradient-text">Projects</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          주요 프로젝트들을 확인해보세요
        </p>

        <div className="space-y-12">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-2xl font-semibold mb-6 text-white">
                {CATEGORY_LABELS[category] || category}
              </h3>
              <ProjectCarousel projects={projectsByCategory[category]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
