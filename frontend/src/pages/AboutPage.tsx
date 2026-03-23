import { motion } from 'framer-motion'
import { NNCard } from '@components/ui/NNCard'
import { NNBadge } from '@components/ui/NNBadge'

const experiences = [
  {
    period: '2024 - Present',
    role: 'AI Engineer',
    company: 'Building Intelligent Systems',
    description: 'Designing and implementing LLM-powered applications, RAG pipelines, and ML infrastructure.',
    techs: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'React'],
  },
]

const techHighlights = [
  { category: 'AI/ML', items: ['PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain', 'RAG'] },
  { category: 'Backend', items: ['FastAPI', 'Python', 'Node.js', 'PostgreSQL'] },
  { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
  { category: 'Cloud', items: ['AWS', 'Docker', 'CI/CD'] },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="nn-label text-nn-tertiary mb-4">The Architect</p>
        <h1 className="nn-display text-nn-on-surface mb-6">
          About <span className="nn-gradient-text">Me</span>
        </h1>
        <p className="text-nn-on-surface-variant text-lg max-w-3xl leading-relaxed mb-16">
          AI Engineer passionate about building intelligent systems that solve real-world problems.
          I specialize in Large Language Models, Natural Language Processing, and Machine Learning
          infrastructure, transforming complex data into elegant, scalable solutions.
        </p>
      </motion.div>

      {/* Experience Timeline */}
      <section className="mb-20">
        <h2 className="nn-headline text-nn-on-surface mb-8">Experience</h2>
        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <NNCard className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-nn-on-surface font-semibold text-xl">{exp.role}</h3>
                    <p className="text-nn-primary">{exp.company}</p>
                  </div>
                  <NNBadge>{exp.period}</NNBadge>
                </div>
                <p className="text-nn-on-surface-variant mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.techs.map((tech) => (
                    <NNBadge key={tech} variant="accent">{tech}</NNBadge>
                  ))}
                </div>
              </NNCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Highlights */}
      <section>
        <h2 className="nn-headline text-nn-on-surface mb-8">Core Technologies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techHighlights.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <NNCard className="p-6">
                <p className="nn-label text-nn-tertiary mb-3">{group.category}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <NNBadge key={item}>{item}</NNBadge>
                  ))}
                </div>
              </NNCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
