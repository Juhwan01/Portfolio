import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '@services/api'
import type { AIProject } from '@types/index'
import Card from '@components/common/Card'

const Dashboard = () => {
  const [projects, setProjects] = useState<AIProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: '🚀' },
    { label: 'Featured', value: projects.filter((p) => p.featured).length, icon: '⭐' },
    { label: 'LLM Projects', value: projects.filter((p) => p.modelType === 'LLM').length, icon: '🤖' },
    { label: 'CV Projects', value: projects.filter((p) => p.modelType === 'Computer Vision').length, icon: '👁️' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your portfolio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} hover={false}>
            <div className="flex items-center gap-4">
              <div className="text-3xl">{stat.icon}</div>
              <div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            to="/admin/projects"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-2"
          >
            <span>🚀</span>
            <span>Manage Projects</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
          >
            <span>🌐</span>
            <span>View Site</span>
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
        <div className="glass-dark rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-400 font-medium">Title</th>
                <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                <th className="text-left p-4 text-gray-400 font-medium">Featured</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 5).map((project) => (
                <tr key={project.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">{project.title}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-sm">
                      {project.modelType}
                    </span>
                  </td>
                  <td className="p-4">{project.featured ? '⭐' : '-'}</td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400">
                    No projects yet.{' '}
                    <Link to="/admin/projects" className="text-blue-400 hover:underline">
                      Add your first project
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
