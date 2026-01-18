import { useEffect, useState } from 'react'
import { getSkills } from '@services/api'
import type { Skill } from '@/types'
import Card from '@components/common/Card'

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchSkills()
  }, [])

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
      <section id="skills" className="section-container bg-gradient-to-b from-transparent to-black/50">
        <div className="text-center">Loading skills...</div>
      </section>
    )
  }

  return (
    <section id="skills" className="section-container bg-gradient-to-b from-transparent to-black/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Technical <span className="gradient-text">Skills</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          기술 스택 및 사용 가능한 도구들
        </p>

        {skills.length === 0 ? (
          <div className="text-center text-gray-500">
            스킬이 아직 등록되지 않았습니다.
          </div>
        ) : Object.keys(groupedSkills).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <Card key={category}>
                <h3 className="text-2xl font-bold mb-6">{category}</h3>
                <div className="flex flex-wrap gap-3">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-sm font-medium border border-white/10 hover:border-white/30 transition"
                    >
                      {skill.icon && <span className="mr-2">{skill.icon}</span>}
                      {skill.name}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-sm font-medium border border-white/10 hover:border-white/30 transition"
              >
                {skill.icon && <span className="mr-2">{skill.icon}</span>}
                {skill.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Skills
