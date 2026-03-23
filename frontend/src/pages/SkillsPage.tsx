import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getSkills } from '@services/api'
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
    techs: ['PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain', 'RAG', 'Fine-tuning'],
  },
  Backend: {
    label: 'Backend',
    techs: ['FastAPI', 'Python', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  'Cloud & DevOps': {
    label: 'Cloud & DevOps',
    techs: ['AWS', 'GCP', 'Kubernetes', 'CI/CD'],
  },
  'Data Systems': {
    label: 'Data Systems',
    techs: ['Vector DB', 'Redis', 'Pandas', 'NumPy', 'SQL'],
  },
  Frontend: {
    label: 'Frontend',
    techs: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
}

const PROFICIENCIES = [
  { name: 'Neural Architectures', percent: 95 },
  { name: 'Distributed Systems', percent: 88 },
  { name: 'NLP & LLM Ops', percent: 92 },
  { name: 'Data Engineering', percent: 84 },
]

const CERTIFICATIONS = [
  {
    title: 'AWS Certified Solutions Architect',
    description:
      'Professional level certification focusing on high-availability and fault-tolerant distributed systems.',
    date: '2023 - Q4',
    align: 'left' as const,
  },
  {
    title: 'Deep Learning Specialization',
    description:
      'Coursera / DeepLearning.AI — Mastery of CNNs, RNNs, and Transformer optimizations.',
    date: '2023 - Q2',
    align: 'right' as const,
  },
  {
    title: 'Natural Language Processing Specialization',
    description:
      'Advanced sequence modeling and attention mechanisms for generative tasks.',
    date: '2022 - Q4',
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

function ProficiencyBar({ name, percent, delay }: { name: string; percent: number; delay: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm uppercase tracking-wider font-bold">{name}</span>
        <span className="text-primary font-bold">{percent}%</span>
      </div>
      <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-dim to-primary"
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          transition={{ duration: 1, delay }}
          viewport={{ once: true }}
        />
      </div>
    </div>
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

      {/* Proficiency Visualization */}
      <section className="mb-32">
        <motion.h2
          className="text-3xl font-bold mb-12 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Core Proficiencies
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
          <div className="space-y-6">
            {PROFICIENCIES.slice(0, 2).map((p, i) => (
              <ProficiencyBar key={p.name} name={p.name} percent={p.percent} delay={i * 0.2} />
            ))}
          </div>
          <div className="space-y-6">
            {PROFICIENCIES.slice(2).map((p, i) => (
              <ProficiencyBar key={p.name} name={p.name} percent={p.percent} delay={i * 0.2} />
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Growth */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
          <motion.h2
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Certifications & Growth
          </motion.h2>
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10 text-center">
              <span className="block text-4xl font-bold text-primary mb-1">12+</span>
              <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Specializations
              </span>
            </div>
            <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10 text-center">
              <span className="block text-4xl font-bold text-primary mb-1">5</span>
              <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                Cloud Certs
              </span>
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-outline-variant/20 hidden md:block" />
          <div className="space-y-16">
            {CERTIFICATIONS.map((cert, i) => (
              <TimelineItem
                key={cert.title}
                title={cert.title}
                description={cert.description}
                date={cert.date}
                align={cert.align}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
