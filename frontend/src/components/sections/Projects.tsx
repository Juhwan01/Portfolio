import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '@services/api'
import type { Project } from '@types/index'
import Card from '@components/common/Card'

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
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Featured <span className="gradient-text">Projects</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          주요 프로젝트들을 확인해보세요
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link key={project.id} to={`/project/${project.id}`}>
              <Card>
                {project.thumbnailUrl && (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                {project.category && (
                  <div className="mb-2 text-sm text-blue-400">{project.category}</div>
                )}
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-white/5 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
