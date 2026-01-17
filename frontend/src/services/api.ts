import axios from 'axios'
import { API_BASE_URL } from '@utils/constants'
import type { Project, BlogPost, ContactForm, Experience, Research, Skill } from '@types/index'

// snake_case to camelCase 변환
const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

const transformKeys = (obj: any): any => {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(transformKeys)
  if (typeof obj !== 'object') return obj

  const transformed: any = {}
  for (const key in obj) {
    const camelKey = toCamelCase(key)
    transformed[camelKey] = transformKeys(obj[key])
  }
  return transformed
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    const { state } = JSON.parse(authStorage)
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`
    }
  }
  return config
})

// Transform response keys to camelCase & Handle 401
api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = transformKeys(response.data)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export interface LoginData {
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export const login = async (data: LoginData): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>('/api/auth/login', data)
  return response.data
}

export const register = async (data: LoginData): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>('/api/auth/register', data)
  return response.data
}

// Projects - Read
export const getProjects = async (params?: { featured?: boolean; category?: string; status?: string }) => {
  const response = await api.get<Project[]>('/api/projects', { params })
  return response.data
}

export const getProjectById = async (id: string) => {
  const response = await api.get<Project>(`/api/projects/${id}`)
  return response.data
}

// Projects - Write (requires auth)
export interface ProjectCreateData {
  id: string
  title: string
  description: string
  content?: string
  category?: string
  tech_stack: string[]
  thumbnail_url?: string
  images?: string[]
  demo_url?: string
  github_url?: string
  featured?: boolean
  status?: string
  start_date?: string
  end_date?: string
  order?: number
}

export interface ProjectUpdateData {
  title?: string
  description?: string
  content?: string
  category?: string
  tech_stack?: string[]
  thumbnail_url?: string
  images?: string[]
  demo_url?: string
  github_url?: string
  featured?: boolean
  status?: string
  start_date?: string
  end_date?: string
  order?: number
}

export const createProject = async (data: ProjectCreateData): Promise<Project> => {
  const response = await api.post<Project>('/api/projects', data)
  return response.data
}

export const updateProject = async (id: string, data: ProjectUpdateData): Promise<Project> => {
  const response = await api.put<Project>(`/api/projects/${id}`, data)
  return response.data
}

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/api/projects/${id}`)
}

// Skills - Read
export const getSkills = async (category?: string) => {
  const params = category ? { category } : {}
  const response = await api.get<Skill[]>('/api/skills', { params })
  return response.data
}

// Skills - Write (requires auth)
export interface SkillCreateData {
  name: string
  category?: string
  icon?: string
  order?: number
}

export interface SkillUpdateData {
  name?: string
  category?: string
  icon?: string
  order?: number
}

export const createSkill = async (data: SkillCreateData): Promise<Skill> => {
  const response = await api.post<Skill>('/api/skills', data)
  return response.data
}

export const createSkillsBulk = async (data: SkillCreateData[]): Promise<Skill[]> => {
  const response = await api.post<Skill[]>('/api/skills/bulk', data)
  return response.data
}

export const updateSkill = async (id: number, data: SkillUpdateData): Promise<Skill> => {
  const response = await api.put<Skill>(`/api/skills/${id}`, data)
  return response.data
}

export const deleteSkill = async (id: number): Promise<void> => {
  await api.delete(`/api/skills/${id}`)
}

// Upload
export interface UploadResponse {
  url: string
  filename: string
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post<UploadResponse>('/api/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Blog
export const getBlogPosts = async () => {
  const response = await api.get<BlogPost[]>('/api/blog')
  return response.data
}

export const getBlogPostById = async (id: string) => {
  const response = await api.get<BlogPost>(`/api/blog/${id}`)
  return response.data
}

// Experience
export const getExperiences = async () => {
  const response = await api.get<Experience[]>('/api/experience')
  return response.data
}

// Research
export const getResearch = async () => {
  const response = await api.get<Research[]>('/api/research')
  return response.data
}

// Contact
export const submitContactForm = async (data: ContactForm) => {
  const response = await api.post('/api/contact', data)
  return response.data
}

export default api
