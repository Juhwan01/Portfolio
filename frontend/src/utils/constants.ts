export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
export const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL

export const SOCIAL_LINKS = {
  github: 'https://github.com/Juhwan01',
  blog: 'https://velog.io/@juhwan01/posts',
  email: 'your.email@example.com',
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

export const CATEGORY_LABELS: Record<string, string> = {
  Web: '웹 서비스',
  Backend: '백엔드',
  AI: 'AI / ML',
  Mobile: '모바일',
  DevOps: 'DevOps',
  Data: '데이터',
  Other: '기타',
}

export const PROJECT_STATUS = [
  'completed',
  'in_progress',
  'archived',
] as const
