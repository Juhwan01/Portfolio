import type { Project, BlogPost, Skill, ContactForm, Experience, Research } from '@/types'

export const mockProject: Project = {
  id: 'test-project-1',
  title: 'AI ChatBot',
  description: 'An AI-powered chatbot for customer service',
  content: '## Overview\n\nThis is a detailed markdown content.',
  category: 'AI',
  techStack: ['React', 'Python', 'FastAPI', 'OpenAI'],
  thumbnailUrl: 'https://example.com/thumb.png',
  images: ['https://example.com/img1.png', 'https://example.com/img2.png'],
  demoUrl: 'https://demo.example.com',
  githubUrl: 'https://github.com/test/project',
  featured: true,
  status: 'completed',
  startDate: '2024-01-01',
  endDate: '2024-06-01',
  order: 1,
  videoUrl: 'https://youtube.com/watch?v=test',
  teamComposition: [
    { role: 'Frontend', count: 2 },
    { role: 'Backend', count: 1 },
  ],
  slideUrl: 'https://docs.google.com/presentation/d/test',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
}

export const mockProject2: Project = {
  id: 'test-project-2',
  title: 'Portfolio Website',
  description: 'A personal portfolio built with React',
  category: 'Web',
  techStack: ['React', 'TypeScript', 'Tailwind'],
  images: [],
  featured: false,
  status: 'in_progress',
  order: 2,
  createdAt: '2024-03-01T00:00:00Z',
}

export const mockProjects: Project[] = [mockProject, mockProject2]

export const mockBlogPost: BlogPost = {
  id: 'test-blog-1',
  title: 'Understanding Transformers',
  excerpt: 'A deep dive into transformer architecture',
  content: '## Transformers\n\nTransformers are a type of neural network...',
  coverImage: 'https://example.com/cover.png',
  tags: ['AI', 'Deep Learning', 'NLP'],
  publishedAt: '2024-03-15T00:00:00Z',
  readTime: 5,
  category: 'research',
}

export const mockBlogPost2: BlogPost = {
  id: 'test-blog-2',
  title: 'React Performance Tips',
  excerpt: 'Optimize your React applications',
  content: '## Performance\n\nHere are some tips...',
  coverImage: 'https://example.com/cover2.png',
  tags: ['React', 'Performance'],
  publishedAt: '2024-04-01T00:00:00Z',
  readTime: 3,
  category: 'tutorial',
}

export const mockBlogPosts: BlogPost[] = [mockBlogPost, mockBlogPost2]

export const mockSkills: Skill[] = [
  { id: 1, name: 'React', category: 'Frontend', icon: 'react', order: 1, createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'TypeScript', category: 'Frontend', icon: 'typescript', order: 2, createdAt: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Python', category: 'Backend', icon: 'python', order: 1, createdAt: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'FastAPI', category: 'Backend', icon: 'fastapi', order: 2, createdAt: '2024-01-01T00:00:00Z' },
  { id: 5, name: 'TensorFlow', category: 'AI', icon: 'tensorflow', order: 1, createdAt: '2024-01-01T00:00:00Z' },
]

export const mockContactForm: ContactForm = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I would like to discuss a potential collaboration.',
}

export const mockExperiences: Experience[] = [
  {
    id: 'exp-1',
    company: 'Tech Corp',
    position: 'AI Engineer',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    description: 'Developed AI solutions',
    technologies: ['Python', 'TensorFlow', 'React'],
    achievements: ['Improved model accuracy by 20%'],
  },
]

export const mockResearch: Research[] = [
  {
    id: 'res-1',
    title: 'Novel Approach to NLP',
    authors: ['Jung Juhwan', 'Kim Minsoo'],
    conference: 'ACL 2024',
    year: '2024',
    abstract: 'We propose a novel approach...',
    pdfUrl: 'https://example.com/paper.pdf',
    citationCount: 10,
  },
]
