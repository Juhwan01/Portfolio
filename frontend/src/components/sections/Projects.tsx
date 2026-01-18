import { useEffect, useState } from 'react'
import { getProjects } from '@services/api'
import type { Project } from '@/types'
import ProjectCarousel from '@components/common/ProjectCarousel'

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

  if (loading) {
    return (
      <section id="projects" className="section-container">
        <div className="text-center">Loading projects...</div>
      </section>
    )
  }

  return (
    <section id="projects" className="section-container">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Featured <span className="gradient-text">Projects</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          주요 프로젝트들을 확인해보세요
        </p>

        <ProjectCarousel projects={projects} />
      </div>
    </section>
  )
}

export default Projects
