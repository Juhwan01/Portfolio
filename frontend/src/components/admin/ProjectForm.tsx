import { useState } from 'react'
import { createProject, updateProject, type ProjectCreateData } from '@services/api'
import type { AIProject } from '@types/index'
import Button from '@components/common/Button'
import ImageUpload from './ImageUpload'
import { MODEL_TYPES } from '@utils/constants'

interface ProjectFormProps {
  project?: AIProject | null
  onSuccess: () => void
  onCancel: () => void
}

const ProjectForm = ({ project, onSuccess, onCancel }: ProjectFormProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<ProjectCreateData>({
    id: project?.id || '',
    title: project?.title || '',
    description: project?.description || '',
    long_description: project?.longDescription || '',
    model_type: project?.modelType || 'LLM',
    frameworks: project?.frameworks || [],
    technologies: project?.technologies || [],
    image_url: project?.imageUrl || '',
    demo_url: project?.demoUrl || '',
    github_url: project?.githubUrl || '',
    paper_url: project?.paperUrl || '',
    model_card_url: project?.modelCardUrl || '',
    featured: project?.featured || false,
    metrics: project?.metrics || [],
    dataset: project?.dataset || '',
  })

  const [frameworkInput, setFrameworkInput] = useState('')
  const [techInput, setTechInput] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleAddFramework = () => {
    if (frameworkInput.trim() && !formData.frameworks.includes(frameworkInput.trim())) {
      setFormData({
        ...formData,
        frameworks: [...formData.frameworks, frameworkInput.trim()],
      })
      setFrameworkInput('')
    }
  }

  const handleRemoveFramework = (fw: string) => {
    setFormData({
      ...formData,
      frameworks: formData.frameworks.filter((f) => f !== fw),
    })
  }

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      })
      setTechInput('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (project) {
        const { id, ...updateData } = formData
        await updateProject(project.id, updateData)
      } else {
        const id = formData.id || formData.title.toLowerCase().replace(/\s+/g, '-')
        await createProject({ ...formData, id })
      }
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project ID {!project && <span className="text-gray-500">(auto-generated if empty)</span>}
          </label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            disabled={!!project}
            placeholder="my-project-id"
            className={`${inputClass} ${project ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Model Type <span className="text-red-400">*</span>
          </label>
          <select
            name="model_type"
            value={formData.model_type}
            onChange={handleChange}
            required
            className={inputClass}
          >
            {MODEL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
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
          placeholder="My Awesome AI Project"
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
          placeholder="A brief description of your project"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Long Description
        </label>
        <textarea
          name="long_description"
          value={formData.long_description}
          onChange={handleChange}
          rows={4}
          placeholder="Detailed description of your project..."
          className={inputClass}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Project Image <span className="text-red-400">*</span>
        </label>
        <ImageUpload
          value={formData.image_url}
          onChange={(url) => setFormData({ ...formData, image_url: url })}
        />
      </div>

      {/* Frameworks */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Frameworks <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={frameworkInput}
            onChange={(e) => setFrameworkInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFramework())}
            placeholder="e.g. PyTorch, TensorFlow"
            className={inputClass}
          />
          <Button type="button" variant="secondary" onClick={handleAddFramework}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.frameworks.map((fw) => (
            <span
              key={fw}
              className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm flex items-center gap-2"
            >
              {fw}
              <button
                type="button"
                onClick={() => handleRemoveFramework(fw)}
                className="hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Technologies <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
            placeholder="e.g. Python, Docker"
            className={inputClass}
          />
          <Button type="button" variant="secondary" onClick={handleAddTech}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm flex items-center gap-2"
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Paper URL
          </label>
          <input
            type="url"
            name="paper_url"
            value={formData.paper_url}
            onChange={handleChange}
            placeholder="https://arxiv.org/abs/..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Model Card URL
          </label>
          <input
            type="url"
            name="model_card_url"
            value={formData.model_card_url}
            onChange={handleChange}
            placeholder="https://huggingface.co/..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Dataset */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Dataset
        </label>
        <input
          type="text"
          name="dataset"
          value={formData.dataset}
          onChange={handleChange}
          placeholder="e.g. ImageNet, Custom Dataset"
          className={inputClass}
        />
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
          Featured project (displayed on homepage)
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
