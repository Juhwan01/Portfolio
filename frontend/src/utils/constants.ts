export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
export const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL

export const SOCIAL_LINKS = {
  github: 'https://github.com/Juhwan01',
  blog: 'https://velog.io/@juhwan01/posts',
  email: 'wnghks5432@gmail.com',
}

export const PROJECT_CATEGORIES = [
  'AI',
  'ML',
  'Web',
  'MCP',
] as const

export const CATEGORY_LABELS: Record<string, string> = {
  AI: 'AI',
  ML: 'ML',
  Web: 'Web',
  MCP: 'MCP',
}

export const PROJECT_STATUS = [
  'completed',
  'in_progress',
  'archived',
] as const
