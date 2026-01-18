import { useEffect, useState } from 'react'
import { getSkills, createSkill, updateSkill, deleteSkill, type SkillCreateData } from '@services/api'
import type { Skill } from '@/types'
import Button from '@components/common/Button'

const SkillsAdmin = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<SkillCreateData>({
    name: '',
    category: '',
    icon: '',
    order: 0,
  })

  const fetchSkills = async () => {
    try {
      const data = await getSkills()
      setSkills(data)
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleCreate = () => {
    setEditingSkill(null)
    setFormData({ name: '', category: '', icon: '', order: 0 })
    setShowForm(true)
    setError('')
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category || '',
      icon: skill.icon || '',
      order: skill.order,
    })
    setShowForm(true)
    setError('')
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteSkill(id)
      setSkills(skills.filter((s) => s.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete skill:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('스킬 이름을 입력하세요')
      return
    }

    setError('')
    setSaving(true)

    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, formData)
      } else {
        await createSkill(formData)
      }
      setShowForm(false)
      setEditingSkill(null)
      fetchSkills()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition text-white'

  // 카테고리별로 스킬 그룹화
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

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
          <h1 className="text-3xl font-bold mb-2">Skills</h1>
          <p className="text-gray-400">기술 스택을 관리하세요</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          + Add Skill
        </Button>
      </div>

      {/* Skills by Category */}
      {Object.keys(groupedSkills).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="glass-dark rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-300">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group relative px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-white/10 hover:border-white/30 transition"
                  >
                    <span className="font-medium">
                      {skill.icon && <span className="mr-2">{skill.icon}</span>}
                      {skill.name}
                    </span>
                    <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded-full text-xs flex items-center justify-center"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(skill.id)}
                        className="w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-dark rounded-xl p-8 text-center text-gray-400">
          No skills yet. Click "Add Skill" to create one.
        </div>
      )}

      {/* Skill Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingSkill ? 'Edit Skill' : 'New Skill'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skill Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Python, React, AWS"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Language, Framework, Cloud"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon (emoji or icon name)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g. 🐍, ⚛️"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order (낮을수록 먼저 표시)
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className={inputClass}
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-400/10 py-2 px-4 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-4 justify-end pt-4">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : editingSkill ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">Delete Skill?</h3>
            <p className="text-gray-400 mb-6">
              이 스킬을 삭제하시겠습니까?
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

export default SkillsAdmin
