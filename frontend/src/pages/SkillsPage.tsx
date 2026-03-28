import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getSkills } from '@services/api'
import SEO from '@components/common/SEO'
import type { Skill } from '@/types'

const CATEGORY_ICON_MAP: Record<string, string> = {
  'AI/ML': 'psychology',
  AI: 'psychology',
  Backend: 'terminal',
  Cloud: 'cloud',
  DevOps: 'cloud',
  'Cloud & DevOps': 'cloud',
  Data: 'database',
  Database: 'database',
  'Data Systems': 'database',
  Language: 'code',
  Tools: 'build',
}

const CATEGORY_ORDER = ['AI/ML', 'Backend', 'Cloud & DevOps', 'Database', 'Language', 'Tools']

const STATIC_SKILLS: Record<string, { label: string; description?: string; techs: string[] }> = {
  'AI/ML': {
    label: 'AI / ML',
    techs: ['PyTorch', 'LangGraph', 'LangChain', 'Hugging Face', 'RAG', 'MLflow'],
  },
  Backend: {
    label: 'Backend',
    techs: ['FastAPI', 'Python', 'Docker', 'Git'],
  },
  'Cloud & DevOps': {
    label: 'Cloud & DevOps',
    techs: ['AWS', 'GCP', 'Docker Compose'],
  },
  Database: {
    label: 'Database',
    techs: ['ChromaDB', 'OpenSearch', 'PostgreSQL'],
  },
  Language: {
    label: 'Language',
    techs: ['Python'],
  },
  Tools: {
    label: 'Tools',
    techs: ['MCP', 'Claude Code', 'Jira', 'GitHub', 'Notion'],
  },
}


const filledIconStyle = { fontVariationSettings: "'FILL' 1" }

function getCategoryIcon(category: string): string {
  return CATEGORY_ICON_MAP[category] ?? 'code'
}

function normalizeCategoryKey(category: string): string {
  if (category.includes('AI') || category.includes('ML')) return 'AI/ML'
  if (category.includes('Cloud') || category.includes('DevOps')) return 'Cloud & DevOps'
  if (category.includes('Data') || category.includes('Database')) return 'Database'
  if (category.includes('Backend')) return 'Backend'
  if (category.includes('Language')) return 'Language'
  if (category.includes('Tools')) return 'Tools'
  return category
}

interface SkillCategory {
  label: string
  description?: string
  techs: string[]
  icon: string
}

function BentoCard({
  category,
  isLarge,
  index,
}: {
  category: SkillCategory
  isLarge: boolean
  index: number
}) {
  return (
    <motion.div
      className={`${
        isLarge ? 'md:col-span-8' : 'md:col-span-4'
      } bg-surface-container-low rounded-xl p-8 neural-glow bento-card relative overflow-hidden transition-all duration-300 hover:bg-surface-container-high group`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 border border-outline-variant opacity-10 rounded-xl ghost-border transition-opacity duration-300" />
      <div className={`relative z-10 h-full flex flex-col ${isLarge ? 'justify-between' : 'justify-between'}`}>
        <div>
          <span
            className="material-symbols-outlined text-primary text-4xl mb-4"
            style={filledIconStyle}
          >
            {category.icon}
          </span>
          <h3 className="text-2xl font-bold mb-4">{category.label}</h3>
          {category.description && (
            <p className="text-on-surface-variant mb-8 max-w-md">{category.description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {category.techs.map((tech) => (
            <span
              key={tech}
              className="bg-surface-container-highest px-3 py-1 rounded text-[0.75rem] uppercase tracking-widest font-bold flex items-center gap-2"
            >
              {isLarge && <span className="w-1 h-1 rounded-full bg-tertiary" />}
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
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

  const buildCategories = (): SkillCategory[] => {
    if (skills.length === 0) {
      return CATEGORY_ORDER.map((key) => ({
        ...STATIC_SKILLS[key],
        icon: getCategoryIcon(key),
      }))
    }

    const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
      const normalized = normalizeCategoryKey(skill.category ?? 'Other')
      return { ...acc, [normalized]: [...(acc[normalized] ?? []), skill] }
    }, {})

    return CATEGORY_ORDER.map((key) => {
      const apiSkills = grouped[key]
      if (apiSkills && apiSkills.length > 0) {
        return {
          label: STATIC_SKILLS[key]?.label ?? key,
          description: key === 'AI/ML' ? STATIC_SKILLS[key]?.description : undefined,
          techs: apiSkills.map((s) => s.name),
          icon: getCategoryIcon(key),
        }
      }
      return {
        ...STATIC_SKILLS[key],
        icon: getCategoryIcon(key),
      }
    })
  }

  const categories = loading ? [] : buildCategories()

  return (
    <>
    <SEO
      title="Skills"
      description="AI/ML, Backend, Cloud & DevOps, Data Systems, Language, Tools 기술 스택 소개."
      path="/skills"
    />
    <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.section
        className="mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.04em] mb-6 leading-tight">
            Tech <span className="text-primary-dim">Stack</span>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl">
            모델 학습부터 LLM 에이전트 오케스트레이션, 백엔드 개발, 클라우드 배포까지
            AI 시스템 전체 파이프라인을 다룹니다.
          </p>
        </div>
      </motion.section>

      {/* Bento Grid Skills */}
      <section className="mb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 h-64 rounded-xl bg-surface-container-low animate-pulse" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="md:col-span-4 h-48 rounded-xl bg-surface-container-low animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {categories.map((cat, i) => (
              <BentoCard key={cat.label} category={cat} isLarge={i === 0} index={i} />
            ))}
          </div>
        )}
      </section>

    </main>
    </>
  )
}
