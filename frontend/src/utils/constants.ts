export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
export const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  email: 'your.email@example.com',
  twitter: 'https://twitter.com/yourusername',
}

export const PROJECT_CATEGORIES = [
  'Web',
  'Backend',
  'AI',
  'Mobile',
  'DevOps',
  'Data',
  'Other',
] as const

export const PROJECT_STATUS = [
  'completed',
  'in_progress',
  'archived',
] as const
