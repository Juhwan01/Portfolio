export interface AIProject {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  modelType: 'LLM' | 'Computer Vision' | 'NLP' | 'Reinforcement Learning' | 'Generative AI' | 'Other';
  frameworks: string[]; // PyTorch, TensorFlow, JAX, etc.
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  paperUrl?: string; // Research paper link
  modelCardUrl?: string; // HuggingFace model card
  featured: boolean;
  metrics?: {
    name: string;
    value: string;
  }[];
  dataset?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[]; // ML, NLP, Computer Vision, etc.
  publishedAt: string;
  readTime: number;
  category: 'research' | 'tutorial' | 'case-study' | 'review';
}

export interface Skill {
  name: string;
  category: 'ml-frameworks' | 'languages' | 'cloud-mlops' | 'data' | 'other';
  level: number; // 1-5
  icon?: string;
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
