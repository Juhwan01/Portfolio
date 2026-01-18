import { useEffect, useState } from 'react'
import { getProjects, deleteProject } from '@services/api'
import type { Project } from '@/types'
import Button from '@components/common/Button'
import ProjectForm from '@components/admin/ProjectForm'

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreate = () => {
    setEditingProject(null)
    setShowForm(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id)
      setProjects(projects.filter((p) => p.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingProject(null)
    fetchProjects()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          + Add Project
        </Button>
      </div>

      {/* Projects Table */}
      <div className="glass-dark rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-gray-400 font-medium">Image</th>
              <th className="text-left p-4 text-gray-400 font-medium">Title</th>
              <th className="text-left p-4 text-gray-400 font-medium">Category</th>
              <th className="text-left p-4 text-gray-400 font-medium">Status</th>
              <th className="text-left p-4 text-gray-400 font-medium">Featured</th>
              <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4">
                  {project.thumbnailUrl ? (
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-white/10 rounded flex items-center justify-center text-gray-500">
                      No img
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-medium">{project.title}</div>
                  <div className="text-sm text-gray-400 truncate max-w-xs">
                    {project.description}
                  </div>
                </td>
                <td className="p-4">
                  {project.category && (
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-sm">
                      {project.category}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    project.status === 'completed'
                      ? 'bg-green-600/20 text-green-400'
                      : project.status === 'in_progress'
                      ? 'bg-yellow-600/20 text-yellow-400'
                      : 'bg-gray-600/20 text-gray-400'
                  }`}>
                    {project.status === 'completed' ? '완료' : project.status === 'in_progress' ? '진행중' : '보관'}
                  </span>
                </td>
                <td className="p-4">{project.featured ? '⭐' : '-'}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(project.id)}
                      className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No projects yet. Click "Add Project" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ProjectForm
                project={editingProject}
                onSuccess={handleFormSuccess}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">Delete Project?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectsAdmin
