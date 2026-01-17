import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProjectById } from '@services/api'
import type { Project } from '@types/index'
import Navbar from '@components/common/Navbar'
import Footer from '@components/common/Footer'

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
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
          {project.category && (
            <div className="mb-4 text-sm text-blue-400">{project.category}</div>
          )}
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-gray-400 mb-4">{project.description}</p>

          {/* 기간 표시 */}
          {(project.startDate || project.endDate) && (
            <p className="text-gray-500 mb-8">
              {project.startDate} {project.endDate && `~ ${project.endDate}`}
            </p>
          )}

          {/* 기술 스택 */}
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm bg-white/5 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* 썸네일 이미지 */}
          {project.thumbnailUrl && (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full rounded-lg mb-8"
            />
          )}

          {/* 상세 설명 (마크다운) */}
          {project.content && (
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-lg whitespace-pre-wrap">{project.content}</p>
            </div>
          )}

          {/* 추가 이미지들 */}
          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {project.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${project.title} - ${index + 1}`}
                  className="w-full rounded-lg"
                />
              ))}
            </div>
          )}

          {/* 링크 버튼들 */}
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProjectDetail
