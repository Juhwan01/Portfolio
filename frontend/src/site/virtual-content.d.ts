declare module 'virtual:content' {
  import type { Post, Profile, Project, Skills } from '@/site/types'

  export const profile: Profile
  export const projects: Project[]
  export const posts: Post[]
  export const skills: Skills
  /** old DB project id -> slug, so links to the previous site keep working */
  export const redirects: Record<string, string>
}
