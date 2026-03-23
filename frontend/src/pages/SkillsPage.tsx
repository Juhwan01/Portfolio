import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getSkills } from '@services/api'
import { NNCard } from '@components/ui/NNCard'
import { NNBadge } from '@components/ui/NNBadge'
import type { Skill } from '@/types'

const categoryIcons: Record<string, string> = {
  'AI/ML': '🧠',
  Backend: '⚙️',
  Frontend: '🎨',
  Cloud: '☁️',
  Data: '📊',
  DevOps: '🔧',
  Other: '📦',
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .catch((err) => console.error('Failed to fetch skills:', err))
      .finally(() => setLoading(false))
  }, [])

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'Other'
    return { ...acc, [cat]: [...(acc[cat] || []), skill] }
  }, {})

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="nn-label text-nn-tertiary mb-4">Technical Arsenal</p>
        <h1 className="nn-display text-nn-on-surface mb-6">
          Skills & <span className="nn-gradient-text">Expertise</span>
        </h1>
        <p className="text-nn-on-surface-variant text-lg max-w-3xl mb-16">
          Technologies and tools I use to build intelligent systems.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-nn-surface-low animate-pulse" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20 text-nn-on-surface-variant">
          Skills not yet registered.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(grouped).map(([category, categorySkills], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <NNCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{categoryIcons[category] || '📦'}</span>
                  <h3 className="text-nn-on-surface font-semibold text-xl">{category}</h3>
                  <span className="text-nn-on-surface-variant text-sm ml-auto">
                    {categorySkills.length} skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <NNBadge key={skill.id} variant="accent">
                      {skill.icon && <span className="mr-1">{skill.icon}</span>}
                      {skill.name}
                    </NNBadge>
                  ))}
                </div>
              </NNCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
