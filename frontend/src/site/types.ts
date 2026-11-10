// Shapes of the data in frontend/content/, as produced by the `virtual:content` Vite plugin.
// The schema is documented in frontend/content/README.md.

export interface Period {
  start: string
  end?: string | null
}

export interface Metric {
  value: string
  label: string
  scope: string
}

export interface Feature {
  title: string
  text: string
  image: string
  /** true when this feature is the part I built */
  mine?: boolean
}

export interface Product {
  name: string
  tagline: string
  about: string
  icon?: string
  features: Feature[]
}

export type LinkKind = 'github' | 'website' | 'appstore' | 'playstore' | 'demo' | 'video' | 'slides'

export interface Project {
  slug: string
  title: string
  summary: string
  org?: string
  period: Period
  role?: string
  team?: string
  status: 'shipped' | 'completed' | 'in-progress' | 'archived'
  featured?: boolean
  order: number
  category?: string
  tags?: string[]
  awards?: string[]
  metrics?: Metric[]
  links?: Partial<Record<LinkKind, string>>
  cover?: string
  gallery?: string[]
  part_of?: string
  merged_into?: string
  product?: Product
  responsibilities?: string[]
  body: string
}

export interface ProfileItem {
  org: string
  role?: string
  degree?: string
  note?: string
  period: Period
  points?: string[]
}

export interface DatedItem {
  date: string
  title: string
  project?: string
}

export interface Activity {
  title: string
  org?: string
  period: Period
  date_detail?: string
  place?: string
  summary: string
  photos?: string[]
  links?: Record<string, string>
}

export interface Profile {
  name: string
  name_en: string
  headline: string
  focus: string
  intro: string
  current: { org: string; role: string; summary: string }
  links: { github: string; blog?: string; email: string }
  highlights: { text: string; project?: string }[]
  experience: ProfileItem[]
  education: ProfileItem[]
  awards: DatedItem[]
  competitions: DatedItem[]
  open_source: { title: string; note: string; project?: string }[]
  activities: Activity[]
}

export interface Post {
  id: string
  title: string
  excerpt: string
  category?: string
  tags?: string[]
  read_time?: number
  published_at: string
  body: string
}
