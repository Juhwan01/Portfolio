import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProjectById } from '@services/api'
import MarkdownRenderer from '@components/content/MarkdownRenderer'
import ProjectSidebar from '@components/content/ProjectSidebar'
import SlideViewer from '@components/common/SlideViewer'
import { NNBadge } from '@components/ui/NNBadge'
import SEO from '@components/common/SEO'
import type { Project } from '@/types'

const getYouTubeEmbedUrl = (url: string) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getProjectById(id)
      .then(setProject)
      .catch((err) => console.error('Failed to fetch project:', err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-nn-surface-low rounded w-20" />
          <div className="h-12 bg-nn-surface-low rounded w-3/4" />
          <div className="h-6 bg-nn-surface-low rounded w-full" />
          <div className="h-64 bg-nn-surface-low rounded-xl" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl text-nn-on-surface mb-4">Project not found</h2>
        <Link to="/projects" className="text-nn-primary hover:underline">
          Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <SEO
        title={project.title}
        description={project.description?.slice(0, 160)}
        path={`/projects/${project.id}`}
        image={project.thumbnailUrl || undefined}
        type="article"
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-10">
          <Link to="/projects" className="text-nn-on-surface-variant hover:text-nn-primary text-sm mb-4 inline-block transition-colors">
            ← Back to Projects
          </Link>
          <div className="flex items-center gap-3 mb-2">
            {project.category && <NNBadge variant="accent">{project.category}</NNBadge>}
            {project.status === 'in_progress' && <NNBadge variant="live">In Progress</NNBadge>}
          </div>
          <h1 className="nn-display text-nn-on-surface mb-4">{project.title}</h1>
          <p className="text-lg text-nn-on-surface-variant max-w-3xl">{project.description}</p>
        </div>

        {/* Thumbnail */}
        {project.thumbnailUrl && (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full rounded-xl mb-10 max-h-[480px] object-cover"
          />
        )}

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Video */}
            {project.videoUrl && (
              <div className="mb-8">
                <h2 className="nn-headline text-nn-on-surface mb-4">Demo Video</h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-nn-surface-lowest">
                  <iframe
                    src={getYouTubeEmbedUrl(project.videoUrl)}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}

            {/* Markdown Content */}
            {project.content && (
              <div className="mb-8">
                <MarkdownRenderer content={project.content} />
              </div>
            )}

            {/* Slides */}
            {project.slideUrl && (
              <div className="mb-8">
                <SlideViewer url={project.slideUrl} title="Presentation" />
              </div>
            )}

            {/* Image Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="mb-8">
                <h2 className="nn-headline text-nn-on-surface mb-4">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${project.title} - ${i + 1}`}
                      className="w-full rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <ProjectSidebar project={project} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProjectDetail
