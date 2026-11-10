import { posts, profile, projects, redirects, skills } from 'virtual:content'
import type { LinkKind, Period, Post, Project } from './types'

export { posts, profile }

const visible = projects.filter((p) => p.status !== 'archived').sort((a, b) => a.order - b.order)

export const featuredProjects = visible.filter((p) => p.featured)
export const otherProjects = visible.filter((p) => !p.featured)

/** Resolve a URL segment: a current slug, or an id from the old site. */
export function findProject(slugOrLegacyId: string): Project | undefined {
  const slug = redirects[slugOrLegacyId] ?? slugOrLegacyId
  return projects.find((p) => p.slug === slug)
}

/** The projects before and after this one in list order. */
export function projectNeighbors(slug: string): { prev?: Project; next?: Project } {
  const i = visible.findIndex((p) => p.slug === slug)
  if (i === -1) return {}
  return { prev: visible[i - 1], next: visible[i + 1] }
}

/** The posts before (newer) and after (older) this one. */
export function postNeighbors(id: string): { prev?: Post; next?: Post } {
  const i = sortedPosts.findIndex((p) => p.id === id)
  if (i === -1) return {}
  return { prev: sortedPosts[i - 1], next: sortedPosts[i + 1] }
}

export const sortedPosts: Post[] = [...posts].sort((a, b) => b.published_at.localeCompare(a.published_at))

export const findPost = (id: string) => posts.find((p) => p.id === id)

export interface SkillView {
  name: string
  note?: string
  projects: Project[]
}

/** skills.yaml with each item's projects collected from project tags. */
export const skillGroups: { name: string; items: SkillView[] }[] = skills.groups.map((g) => ({
  name: g.name,
  items: g.items.map((item) => {
    const keys = new Set((item.match ?? [item.name]).map((t) => t.toLowerCase()))
    return {
      name: item.name,
      note: item.note,
      projects: visible.filter((p) => p.tags?.some((t) => keys.has(t.toLowerCase()))),
    }
  }),
}))

export const fmtMonth = (month: string) => month.replace('-', '.')

export function fmtPeriod({ start, end }: Period): string {
  if (!end) return `${fmtMonth(start)} – 현재`
  return start === end ? fmtMonth(start) : `${fmtMonth(start)} – ${fmtMonth(end)}`
}

export const fmtDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '.')

export const LINK_LABELS: Record<LinkKind, string> = {
  website: '웹사이트',
  appstore: 'App Store',
  playstore: 'Google Play',
  github: 'GitHub',
  demo: '바로가기',
  video: '시연 영상',
  slides: '발표 자료',
}

export const isExternal = (url: string) => /^https?:\/\//.test(url)

/** Short name for a project in compact lists: the product name or the title before any " · " or " — ". */
export const shortTitle = (p: Project) => p.product?.name ?? p.title.split(/ · | — /)[0]
