import Card from '@components/common/Card'
import { SKILL_CATEGORIES } from '@utils/constants'

const skillsData = [
  {
    category: 'ml-frameworks' as const,
    skills: [
      { name: 'PyTorch', level: 5 },
      { name: 'TensorFlow', level: 4 },
      { name: 'Hugging Face', level: 5 },
      { name: 'LangChain', level: 4 },
      { name: 'OpenAI API', level: 5 },
    ],
  },
  {
    category: 'languages' as const,
    skills: [
      { name: 'Python', level: 5 },
      { name: 'JavaScript/TypeScript', level: 4 },
      { name: 'C++', level: 3 },
      { name: 'SQL', level: 4 },
    ],
  },
  {
    category: 'cloud-mlops' as const,
    skills: [
      { name: 'AWS (SageMaker, Lambda)', level: 4 },
      { name: 'Docker', level: 4 },
      { name: 'Kubernetes', level: 3 },
      { name: 'MLflow', level: 4 },
      { name: 'Weights & Biases', level: 4 },
    ],
  },
  {
    category: 'data' as const,
    skills: [
      { name: 'Pandas', level: 5 },
      { name: 'NumPy', level: 5 },
      { name: 'Apache Spark', level: 3 },
      { name: 'PostgreSQL', level: 4 },
    ],
  },
]

const Skills = () => {
  return (
    <section id="skills" className="section-container bg-gradient-to-b from-transparent to-black/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Technical <span className="gradient-text">Skills</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Expertise in modern AI/ML frameworks and tools
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillsData.map((category) => (
            <Card key={category.category}>
              <h3 className="text-2xl font-bold mb-6">
                {SKILL_CATEGORIES[category.category]}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-400">{skill.level}/5</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
