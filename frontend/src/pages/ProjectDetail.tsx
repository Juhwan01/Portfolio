import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProjectById } from '@services/api'
import type { AIProject } from '@types/index'
import Navbar from '@components/common/Navbar'
import Footer from '@components/common/Footer'

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<AIProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return
      try {
        const data = await getProjectById(id)
        setProject(data)
      } catch (error) {
        console.error('Failed to fetch project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Project not found</div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <Navbar />
      <main className="min-h-screen pt-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-gray-400 mb-8">{project.description}</p>

          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full rounded-lg mb-8"
          />

          <div className="prose prose-invert max-w-none">
            <p className="text-lg">{project.longDescription}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 glass rounded-lg hover:bg-white/20 transition"
              >
                GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 glass rounded-lg hover:bg-white/20 transition"
              >
                Live Demo
              </a>
            )}
            {project.paperUrl && (
              <a
                href={project.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 glass rounded-lg hover:bg-white/20 transition"
              >
                Research Paper
              </a>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProjectDetail
