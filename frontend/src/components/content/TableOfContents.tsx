import { useState, useEffect, useCallback } from 'react'
import type { TocItem } from '@/utils/markdown'

interface TableOfContentsProps {
  readonly headings: readonly TocItem[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('')

  const handleClick = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0 }
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="hidden lg:block sticky top-28">
      <p className="text-xs font-bold uppercase tracking-widest text-nn-on-surface-variant/60 mb-4">
        On this page
      </p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => handleClick(heading.id)}
              className={`block w-full text-left text-sm transition-colors py-1 border-l-2 ${
                heading.level === 3 ? 'pl-6' : 'pl-3'
              } ${
                activeId === heading.id
                  ? 'border-nn-primary text-nn-primary font-medium'
                  : 'border-transparent text-nn-on-surface-variant/70 hover:text-nn-on-surface hover:border-nn-outline-variant/30'
              }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
