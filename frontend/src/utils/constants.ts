export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
export const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  email: 'your.email@example.com',
  twitter: 'https://twitter.com/yourusername',
}

export const SKILL_CATEGORIES = {
  'ml-frameworks': 'ML Frameworks',
  'languages': 'Languages',
  'cloud-mlops': 'Cloud & MLOps',
  'data': 'Data Engineering',
  'other': 'Other',
} as const

export const MODEL_TYPES = [
  'LLM',
  'Computer Vision',
  'NLP',
  'Reinforcement Learning',
  'Generative AI',
  'Other',
] as const
