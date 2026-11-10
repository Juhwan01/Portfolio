import type { CSSProperties } from 'react'
import { DEFAULT_ACCENT, shortTitle } from './content'
import type { Project } from './types'

/** Render `*text*` segments as <em> (the accent highlight). */
export function Emphasis({ text }: { readonly text: string }) {
  return (
    <>
      {text.split('*').map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}
    </>
  )
}

export const accentStyle = (p: Project) => ({ '--accent-hero': p.accent ?? DEFAULT_ACCENT }) as CSSProperties

/** The cover image on a tinted panel; projects without one show their headline number instead. */
export function CoverFrame({ project, size = 'large' }: { readonly project: Project; readonly size?: 'large' | 'small' }) {
  const metric = project.metrics?.[0]
  return (
    <div className={`cover-frame ${size}`} style={accentStyle(project)}>
      {project.cover ? (
        <img src={project.cover} alt="" loading="lazy" />
      ) : (
        <div className="cover-fallback">
          <strong>{metric?.value ?? shortTitle(project)}</strong>
          {metric && <span>{metric.label}</span>}
        </div>
      )}
    </div>
  )
}
