import { posts, profile, projects, redirects } from 'virtual:content'
import type { LinkKind, Period, Project } from './types'

export { posts, profile }

const visible = projects.filter((p) => p.status !== 'archived').sort((a, b) => a.order - b.order)

export const featuredProjects = visible.filter((p) => p.featured)
export const otherProjects = visible.filter((p) => !p.featured)

/** Resolve a URL segment: a current slug, or an id from the old site. */
export function findProject(slugOrLegacyId: string): Project | undefined {
  const slug = redirects[slugOrLegacyId] ?? slugOrLegacyId
  return projects.find((p) => p.slug === slug)
}

export const fmtMonth = (month: string) => month.replace('-', '.')

export function fmtPeriod({ start, end }: Period): string {
  if (!end) return `${fmtMonth(start)} – 현재`
  return start === end ? fmtMonth(start) : `${fmtMonth(start)} – ${fmtMonth(end)}`
}

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
