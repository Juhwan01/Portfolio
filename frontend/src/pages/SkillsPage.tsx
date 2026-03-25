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
  'Data Systems': 'database',
  Frontend: 'web',
}

const CATEGORY_ORDER = ['AI/ML', 'Backend', 'Cloud & DevOps', 'Data Systems', 'Frontend']

const STATIC_SKILLS: Record<string, { label: string; description?: string; techs: string[] }> = {
  'AI/ML': {
    label: 'AI / Machine Learning',
    description:
      'Deep focus on Large Language Models, Transformer architectures, and Retrieval-Augmented Generation (RAG) pipelines.',
    techs: ['PyTorch', 'LangGraph', 'LangChain', 'Hugging Face', 'RAG', 'scikit-learn'],
  },
  Backend: {
    label: 'Backend',
    techs: ['FastAPI', 'Python', 'PostgreSQL', 'Docker', 'Git'],
  },
  'Cloud & DevOps': {
    label: 'Cloud & DevOps',
    techs: ['AWS', 'GCP', 'Docker Compose', 'Nginx'],
  },
  'Data Systems': {
    label: 'Data Systems',
    techs: ['ChromaDB', 'OpenSearch', 'Pandas', 'SQL'],
  },
  Frontend: {
    label: 'Frontend',
    techs: ['React', 'TypeScript', 'Tailwind CSS', 'Streamlit'],
  },
}

const ACHIEVEMENTS = [
  {
    title: '우수수료생 & 우수프로젝트상',
    description:
      'kakao x goorm 생성형 AI 부트캠프 — 6개월 과정 우수수료생 선정, "요기어때" 우수프로젝트상 수상.',
    date: '2025.11',
    align: 'left' as const,
  },
  {
    title: 'INJE 캡스톤디자인 경진대회 장려상',
    description:
      'LangGraph 기반 AI 코드 에디터 "W:IDE" 개발. Electron IPC 아키텍처로 브라우저 샌드박스 제약 극복.',
    date: '2024.12',
    align: 'right' as const,
  },
  {
    title: '우수활동팀',
    description:
      '인제대학교 — 개발팀 Praises Us 팀장으로 팀 운영 및 다수 프로젝트 리딩.',
    date: '2025.02',
    align: 'left' as const,
  },
]

const filledIconStyle = { fontVariationSettings: "'FILL' 1" }

function getCategoryIcon(category: string): string {
  return CATEGORY_ICON_MAP[category] ?? 'code'
}

function normalizeCategoryKey(category: string): string {
  if (category.includes('AI') || category.includes('ML')) return 'AI/ML'
  if (category.includes('Cloud') || category.includes('DevOps')) return 'Cloud & DevOps'
  if (category.includes('Data')) return 'Data Systems'
  if (category.includes('Backend')) return 'Backend'
  if (category.includes('Frontend')) return 'Frontend'
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

function TimelineItem({
  title,
  description,
  date,
  align,
  index,
}: {
  title: string
  description: string
  date: string
  align: 'left' | 'right'
  index: number
}) {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-start md:items-center gap-8 relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      viewport={{ once: true }}
    >
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full z-10 neural-glow border-4 border-surface" />
      {align === 'left' ? (
        <>
          <div className="order-2 md:order-1 md:w-1/2 md:pr-12 md:text-right">
            <h4 className="text-xl font-bold mb-2">{title}</h4>
            <p className="text-on-surface-variant text-sm">{description}</p>
          </div>
          <div className="order-1 md:order-2 md:w-1/2 md:pl-12">
            <span className="text-primary font-bold tracking-widest text-sm">{date}</span>
          </div>
        </>
      ) : (
        <>
          <div className="order-1 md:w-1/2 md:pr-12 md:text-right">
            <span className="text-primary font-bold tracking-widest text-sm">{date}</span>
          </div>
          <div className="order-2 md:w-1/2 md:pl-12">
            <h4 className="text-xl font-bold mb-2">{title}</h4>
            <p className="text-on-surface-variant text-sm">{description}</p>
          </div>
        </>
      )}
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
      description="AI/ML, Backend, Cloud & DevOps, Data Systems, Frontend 기술 스택 소개."
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
          <span className="text-sm uppercase tracking-[0.2em] text-primary mb-4 block font-bold">
            Capabilities
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.04em] mb-6 leading-tight">
            Technical <span className="text-primary-dim">Arsenal.</span>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl">
            A multi-disciplinary stack engineered for the age of intelligence. Architecting
            complex AI systems from low-level model fine-tuning to high-performance cloud
            deployments.
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

      {/* Achievements */}
      <section>
        <motion.h2
          className="text-3xl font-bold mb-16 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Achievements
        </motion.h2>

        <div className="relative">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-outline-variant/20 hidden md:block" />
          <div className="space-y-16">
            {ACHIEVEMENTS.map((item, i) => (
              <TimelineItem
                key={item.title}
                title={item.title}
                description={item.description}
                date={item.date}
                align={item.align}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
    </>
  )
}
