import { NNCard } from '@components/ui/NNCard'
import { NNBadge } from '@components/ui/NNBadge'
import { NNButton } from '@components/ui/NNButton'
import type { Project } from '@/types'

interface ProjectSidebarProps {
  project: Project
}

export default function ProjectSidebar({ project }: ProjectSidebarProps) {
  const totalTeam = project.teamComposition?.reduce((sum, t) => sum + t.count, 0) || 0

  return (
    <div className="space-y-4 lg:sticky lg:top-28">
      {/* Meta */}
      <NNCard className="p-5" hoverable={false}>
        <h3 className="nn-label text-nn-tertiary mb-4">Project Info</h3>

        <div className="space-y-3 text-sm">
          {project.category && (
            <div className="flex justify-between">
              <span className="text-nn-on-surface-variant">Category</span>
              <NNBadge variant="accent">{project.category}</NNBadge>
            </div>
          )}

          {project.status && (
            <div className="flex justify-between">
              <span className="text-nn-on-surface-variant">Status</span>
              <NNBadge variant={project.status === 'in_progress' ? 'live' : 'default'}>
                {project.status === 'completed' ? 'Completed' : project.status === 'in_progress' ? 'In Progress' : 'Archived'}
              </NNBadge>
            </div>
          )}

          {(project.startDate || project.endDate) && (
            <div className="flex justify-between">
              <span className="text-nn-on-surface-variant">Period</span>
              <span className="text-nn-on-surface text-right">
                {project.startDate}{project.endDate && ` ~ ${project.endDate}`}
              </span>
            </div>
          )}

          {totalTeam > 0 && (
            <div className="flex justify-between">
              <span className="text-nn-on-surface-variant">Team</span>
              <span className="text-nn-on-surface">{totalTeam} members</span>
            </div>
          )}
        </div>

        {/* Team Composition */}
        {project.teamComposition && project.teamComposition.length > 0 && (
          <div className="mt-4 pt-4 border-t border-nn-outline-variant/10">
            <div className="flex flex-wrap gap-1.5">
              {project.teamComposition.map((t) => (
                <NNBadge key={t.role}>{t.role} {t.count}</NNBadge>
              ))}
            </div>
          </div>
        )}
      </NNCard>

      {/* Tech Stack */}
      {project.techStack.length > 0 && (
        <NNCard className="p-5" hoverable={false}>
          <h3 className="nn-label text-nn-tertiary mb-4">Tech Stack</h3>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <NNBadge key={tech} variant="accent">{tech}</NNBadge>
            ))}
          </div>
        </NNCard>
      )}

      {/* Links */}
      {(project.githubUrl || project.demoUrl) && (
        <NNCard className="p-5" hoverable={false}>
          <h3 className="nn-label text-nn-tertiary mb-4">Links</h3>
          <div className="space-y-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <NNButton variant="secondary" size="sm" className="w-full">
                  GitHub Repository
                </NNButton>
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <NNButton size="sm" className="w-full">
                  Live Demo
                </NNButton>
              </a>
            )}
          </div>
        </NNCard>
      )}
    </div>
  )
}
