import axios from 'axios'
import { API_BASE_URL } from '@utils/constants'
import type { AIProject, BlogPost, ContactForm, Experience, Research } from '@types/index'

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

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
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
export const getProjects = async (featured?: boolean) => {
  const params = featured !== undefined ? { featured } : {}
  const response = await api.get<AIProject[]>('/api/projects', { params })
  return response.data
}

export const getProjectById = async (id: string) => {
  const response = await api.get<AIProject>(`/api/projects/${id}`)
  return response.data
}

// Projects - Write (requires auth)
export interface ProjectCreateData {
  id: string
  title: string
  description: string
  long_description?: string
  model_type: string
  frameworks: string[]
  technologies: string[]
  image_url: string
  demo_url?: string
  github_url?: string
  paper_url?: string
  model_card_url?: string
  featured?: boolean
  metrics?: { name: string; value: string }[]
  dataset?: string
}

export const createProject = async (data: ProjectCreateData): Promise<AIProject> => {
  const response = await api.post<AIProject>('/api/projects', data)
  return response.data
}

export const updateProject = async (id: string, data: Omit<ProjectCreateData, 'id'>): Promise<AIProject> => {
  const response = await api.put<AIProject>(`/api/projects/${id}`, data)
  return response.data
}

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/api/projects/${id}`)
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
