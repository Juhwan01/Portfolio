import { useParams } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { getProjectById } from '@services/api'
import type { Project } from '@/types'
import Navbar from '@components/common/Navbar'
import Footer from '@components/common/Footer'
import NotionRenderer from '@components/common/NotionRenderer'

// 전체 페이지 스켈레톤 컴포넌트
const PageSkeleton = () => (
  <div className="relative w-full">
    <Navbar />
    <main className="min-h-screen pt-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto animate-pulse">
        {/* 카테고리 */}
        <div className="h-4 bg-white/10 rounded w-20 mb-4"></div>

        {/* 제목 */}
        <div className="h-12 bg-white/10 rounded-lg w-3/4 mb-4"></div>

        {/* 설명 */}
        <div className="h-6 bg-white/5 rounded w-full mb-2"></div>
        <div className="h-6 bg-white/5 rounded w-2/3 mb-6"></div>

        {/* 기간 & 팀 */}
        <div className="flex gap-4 mb-6">
          <div className="h-4 bg-white/10 rounded w-32"></div>
          <div className="h-4 bg-white/10 rounded w-16"></div>
        </div>

        {/* 팀 태그 */}
        <div className="flex gap-2 mb-6">
          <div className="h-8 bg-purple-500/10 rounded-full w-24"></div>
          <div className="h-8 bg-purple-500/10 rounded-full w-28"></div>
        </div>

        {/* 기술 스택 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-white/5 rounded-full w-20"></div>
          ))}
        </div>

        {/* 썸네일 이미지 */}
        <div className="w-full h-64 bg-white/5 rounded-lg mb-8"></div>

        {/* 노션 콘텐츠 영역 */}
        <div className="space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/2"></div>
          <div className="h-4 bg-white/5 rounded w-full"></div>
          <div className="h-4 bg-white/5 rounded w-full"></div>
          <div className="h-4 bg-white/5 rounded w-5/6"></div>
          <div className="h-4 bg-white/5 rounded w-4/5"></div>
          <div className="h-64 bg-white/5 rounded-lg mt-6"></div>
          <div className="h-4 bg-white/5 rounded w-full"></div>
          <div className="h-4 bg-white/5 rounded w-3/4"></div>
        </div>
      </div>
    </main>
  </div>
)

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [notionLoading, setNotionLoading] = useState(true)

  // 노션 페이지가 없거나, 노션이 로드 완료되면 false
  const isLoading = dataLoading || (project?.notionPageId ? notionLoading : false)

  const handleNotionLoadingChange = useCallback((loading: boolean) => {
    setNotionLoading(loading)
  }, [])

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return
      try {
        const data = await getProjectById(id)
        setProject(data)
        // 노션 페이지가 없으면 바로 notionLoading을 false로
        if (!data.notionPageId) {
          setNotionLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch project:', error)
        setNotionLoading(false)
      } finally {
        setDataLoading(false)
      }
    }

    fetchProject()
  }, [id])

  // YouTube URL을 embed URL로 변환
  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
    return url
  }

  if (!project && !dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Project not found</div>
      </div>
    )
  }

  const totalTeam = project?.teamComposition?.reduce((sum, t) => sum + t.count, 0) || 0

  return (
    <div className="relative w-full">
      <Navbar />
      <main className="min-h-screen pt-24 px-4 md:px-8 lg:px-16">
        {/* 스켈레톤 - 로딩 중일 때 표시 */}
        <div
          className={`absolute inset-0 pt-24 px-4 md:px-8 lg:px-16 transition-opacity duration-500 ${
            isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <PageSkeleton />
        </div>

        {/* 실제 콘텐츠 - project 로드 후 렌더링, 노션 로딩 중엔 숨김 */}
        {project && (
          <div
            className={`max-w-4xl mx-auto transition-opacity duration-500 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {project.category && (
              <div className="mb-4 text-sm text-blue-400">{project.category}</div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl text-gray-400 mb-4">{project.description}</p>

            {/* 기간 & 팀 구성 */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-500">
              {(project.startDate || project.endDate) && (
                <span>
                  {project.startDate} {project.endDate && `~ ${project.endDate}`}
                </span>
              )}
              {totalTeam > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalTeam}명
                </span>
              )}
            </div>

            {/* 팀 구성 태그 */}
            {project.teamComposition && project.teamComposition.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.teamComposition.map((team) => (
                  <span
                    key={team.role}
                    className="px-3 py-1 text-sm bg-purple-500/20 text-purple-400 rounded-full"
                  >
                    {team.role} {team.count}명
                  </span>
                ))}
              </div>
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

            {/* 영상 */}
            {project.videoUrl && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white">Demo Video</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={getYouTubeEmbedUrl(project.videoUrl)}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}

            {/* 상세 설명 (Content) */}
            {project.content && (
              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-lg whitespace-pre-wrap leading-relaxed">{project.content}</p>
              </div>
            )}

            {/* Notion 임베드 */}
            {project.notionPageId && (
              <div className="mb-8">
                <NotionRenderer
                  pageId={project.notionPageId}
                  onLoadingChange={handleNotionLoadingChange}
                />
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
                  className="px-6 py-3 glass rounded-lg hover:bg-white/20 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 glass rounded-lg hover:bg-white/20 transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default ProjectDetail
