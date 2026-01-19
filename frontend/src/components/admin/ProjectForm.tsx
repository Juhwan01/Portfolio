import { useState } from 'react'
import { createProject, updateProject, type ProjectCreateData, type ProjectUpdateData } from '@services/api'
import type { Project } from '@/types'
import Button from '@components/common/Button'
import ImageUpload from './ImageUpload'
import { PROJECT_CATEGORIES, PROJECT_STATUS } from '@utils/constants'

interface ProjectFormProps {
  project?: Project | null
  onSuccess: () => void
  onCancel: () => void
}

const TEAM_ROLES = ['AI', 'Backend', 'Frontend', 'DevOps', 'Design', 'PM', 'Full-stack']

const ProjectForm = ({ project, onSuccess, onCancel }: ProjectFormProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<Omit<ProjectCreateData, 'id'>>({
    title: project?.title || '',
    description: project?.description || '',
    content: project?.content || '',
    category: project?.category || '',
    tech_stack: project?.techStack || [],
    thumbnail_url: project?.thumbnailUrl || '',
    images: project?.images || [],
    demo_url: project?.demoUrl || '',
    github_url: project?.githubUrl || '',
    featured: project?.featured || false,
    status: project?.status || 'completed',
    start_date: project?.startDate || '',
    end_date: project?.endDate || '',
    order: project?.order || 0,
    notion_page_id: project?.notionPageId || '',
    video_url: project?.videoUrl || '',
    team_composition: project?.teamComposition || [],
    slide_url: project?.slideUrl || '',
  })

  const [techInput, setTechInput] = useState('')
  const [teamRole, setTeamRole] = useState('')
  const [teamCount, setTeamCount] = useState(1)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleAddTech = () => {
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...formData.tech_stack, techInput.trim()],
      })
      setTechInput('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter((t) => t !== tech),
    })
  }

  const handleAddTeamRole = () => {
    if (teamRole && teamCount > 0) {
      const existing = formData.team_composition?.find((t) => t.role === teamRole)
      if (existing) {
        setFormData({
          ...formData,
          team_composition: formData.team_composition?.map((t) =>
            t.role === teamRole ? { ...t, count: teamCount } : t
          ),
        })
      } else {
        setFormData({
          ...formData,
          team_composition: [...(formData.team_composition || []), { role: teamRole, count: teamCount }],
        })
      }
      setTeamRole('')
      setTeamCount(1)
    }
  }

  const handleRemoveTeamRole = (role: string) => {
    setFormData({
      ...formData,
      team_composition: formData.team_composition?.filter((t) => t.role !== role),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (project) {
        console.log('Updating project with ID:', project.id)
        await updateProject(project.id, formData as ProjectUpdateData)
      } else {
        console.log('Creating project')
        await createProject(formData)
      }
      onSuccess()
    } catch (err: any) {
      console.error('API Error:', err)
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition text-white'

  const selectClass =
    'w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition text-white'

  const totalTeam = formData.team_composition?.reduce((sum, t) => sum + t.count, 0) || 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={selectClass}
        >
          <option value="" className="bg-gray-800 text-white">Select category</option>
          {PROJECT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-gray-800 text-white">
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="프로젝트 제목"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Short Description <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={2}
          placeholder="프로젝트에 대한 간단한 설명"
          className={inputClass}
        />
      </div>

      {/* Team Composition */}
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <label className="block text-sm font-medium text-purple-400 mb-2">
          Team Composition
          {totalTeam > 0 && (
            <span className="text-gray-400 font-normal ml-2">(총 {totalTeam}명)</span>
          )}
        </label>
        <div className="flex gap-2 mb-3">
          <select
            value={teamRole}
            onChange={(e) => setTeamRole(e.target.value)}
            className={`${selectClass} flex-1`}
          >
            <option value="" className="bg-gray-800">역할 선택</option>
            {TEAM_ROLES.map((role) => (
              <option key={role} value={role} className="bg-gray-800">
                {role}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={teamCount}
            onChange={(e) => setTeamCount(parseInt(e.target.value) || 1)}
            min={1}
            className={`${inputClass} w-20 text-center`}
            placeholder="인원"
          />
          <Button type="button" variant="secondary" onClick={handleAddTeamRole}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.team_composition?.map((team) => (
            <span
              key={team.role}
              className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm flex items-center gap-2"
            >
              {team.role} {team.count}명
              <button
                type="button"
                onClick={() => handleRemoveTeamRole(team.role)}
                className="hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Content (Markdown 지원)
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={6}
          placeholder="프로젝트에 대한 상세 설명..."
          className={inputClass}
        />
      </div>

      {/* Notion Integration */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <label className="block text-sm font-medium text-blue-400 mb-2">
          Notion Page ID
          <span className="text-gray-500 font-normal ml-2">
            (Content 아래에 Notion 페이지가 임베드됩니다)
          </span>
        </label>
        <input
          type="text"
          name="notion_page_id"
          value={formData.notion_page_id}
          onChange={handleChange}
          placeholder="abc123def456... (Notion URL에서 복사)"
          className={inputClass}
        />
        <p className="mt-2 text-xs text-gray-500">
          Notion URL 예시: notion.so/My-Page-<span className="text-blue-400">abc123def456</span> → abc123def456 입력
        </p>
      </div>

      {/* Video URL */}
      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <label className="block text-sm font-medium text-green-400 mb-2">
          Video URL
          <span className="text-gray-500 font-normal ml-2">(YouTube, Vimeo 등)</span>
        </label>
        <input
          type="url"
          name="video_url"
          value={formData.video_url}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=..."
          className={inputClass}
        />
      </div>

      {/* Google Slides */}
      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
        <label className="block text-sm font-medium text-orange-400 mb-2">
          Google Slides URL
          <span className="text-gray-500 font-normal ml-2">
            (Google Drive에 PPT 업로드 후 공유 링크 붙여넣기)
          </span>
        </label>
        <input
          type="url"
          name="slide_url"
          value={formData.slide_url}
          onChange={handleChange}
          placeholder="https://docs.google.com/presentation/d/.../edit?usp=sharing"
          className={inputClass}
        />
        <p className="mt-2 text-xs text-gray-500">
          Google Slides에서 "공유" → "링크 복사" 후 붙여넣기
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Thumbnail Image
        </label>
        <ImageUpload
          value={formData.thumbnail_url || ''}
          onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
        />
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tech Stack
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
            placeholder="e.g. Python, FastAPI, React"
            className={inputClass}
          />
          <Button type="button" variant="secondary" onClick={handleAddTech}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm flex items-center gap-2"
            >
              {tech}
              <button
                type="button"
                onClick={() => handleRemoveTech(tech)}
                className="hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="text"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            placeholder="2024.01"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Date
          </label>
          <input
            type="text"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            placeholder="2024.06 or 진행중"
            className={inputClass}
          />
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Demo URL
          </label>
          <input
            type="url"
            name="demo_url"
            value={formData.demo_url}
            onChange={handleChange}
            placeholder="https://demo.example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
            className={inputClass}
          />
        </div>
      </div>

      {/* Status & Featured */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={selectClass}
          >
            {PROJECT_STATUS.map((status) => (
              <option key={status} value={status} className="bg-gray-800 text-white">
                {status === 'completed' ? '완료' : status === 'in_progress' ? '진행중' : '보관'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Order (낮을수록 먼저 표시)
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="w-5 h-5 rounded bg-white/5 border-white/10"
        />
        <label htmlFor="featured" className="text-gray-300">
          Featured project (홈페이지에 표시)
        </label>
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-400/10 py-2 px-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-end pt-4 border-t border-white/10">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}

export default ProjectForm
