export interface TeamRole {
  role: string;
  count: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  category?: string;
  techStack: string[];
  thumbnailUrl?: string;
  images: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'completed' | 'in_progress' | 'archived';
  startDate?: string;
  endDate?: string;
  order: number;
  notionPageId?: string;
  videoUrl?: string;
  teamComposition?: TeamRole[];
  createdAt: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  category: 'research' | 'tutorial' | 'case-study' | 'review';
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
  icon?: string;
  order: number;
  createdAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  achievements?: string[];
}

export interface Research {
  id: string;
  title: string;
  authors: string[];
  conference?: string;
  journal?: string;
  year: string;
  abstract: string;
  pdfUrl?: string;
  arxivUrl?: string;
  citationCount?: number;
}
