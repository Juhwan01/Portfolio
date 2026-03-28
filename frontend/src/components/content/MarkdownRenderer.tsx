import { useState, useRef, useCallback, Children, isValidElement, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { Components } from 'react-markdown'
import { slugify } from '@/utils/markdown'

interface MarkdownRendererProps {
  readonly content: string
}

// --- Utility: extract text from React children ---
function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (!isValidElement(node)) return ''
  const children = (node.props as { children?: ReactNode }).children
  if (!children) return ''
  return Children.toArray(children).map(extractText).join('')
}

// --- CodeBlock with copy button + language label ---
function CodeBlock({ children }: { readonly children: ReactNode }) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  let language = ''
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const className = (child.props as { className?: string }).className ?? ''
      const match = className.match(/language-(\w+)/)
      if (match) language = match[1]
    }
  })

  const handleCopy = useCallback(() => {
    const text = preRef.current?.textContent ?? ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  return (
    <div className="relative rounded-lg border border-nn-outline-variant/10 bg-nn-surface-lowest my-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-nn-outline-variant/10 bg-nn-surface-container/50">
        <span className="text-xs text-nn-on-surface-variant font-mono uppercase tracking-wider">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-nn-on-surface-variant hover:text-nn-primary transition-colors"
          aria-label="Copy code"
        >
          <span className="material-symbols-outlined text-base">
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre ref={preRef} className="p-4 overflow-x-auto text-sm font-mono">
        {children}
      </pre>
    </div>
  )
}

// --- Callout detection & rendering ---
const CALLOUT_CONFIG: Record<string, { icon: string; border: string; bg: string; iconColor: string }> = {
  'Note:': { icon: 'info', border: 'border-blue-400', bg: 'bg-blue-400/5', iconColor: 'text-blue-400' },
  'Warning:': { icon: 'warning', border: 'border-amber-400', bg: 'bg-amber-400/5', iconColor: 'text-amber-400' },
  'Tip:': { icon: 'lightbulb', border: 'border-green-400', bg: 'bg-green-400/5', iconColor: 'text-green-400' },
  'Important:': { icon: 'priority_high', border: 'border-red-400', bg: 'bg-red-400/5', iconColor: 'text-red-400' },
}

function detectCalloutType(children: ReactNode): string | null {
  const childArray = Children.toArray(children)
  for (const child of childArray) {
    if (!isValidElement(child)) continue
    const inner = (child.props as { children?: ReactNode }).children
    if (!inner) continue
    const innerArray = Children.toArray(inner)
    for (const item of innerArray) {
      if (isValidElement(item) && (item.type === 'strong' || item.type === 'b')) {
        const text = extractText(item)
        for (const key of Object.keys(CALLOUT_CONFIG)) {
          if (text.includes(key.replace(':', ''))) return key
        }
      }
    }
  }
  return null
}

function Blockquote({ children }: { readonly children: ReactNode }) {
  const calloutType = detectCalloutType(children)

  if (!calloutType) {
    return (
      <blockquote className="border-l-2 border-nn-primary-dim pl-4 my-4 text-nn-on-surface-variant italic">
        {children}
      </blockquote>
    )
  }

  const config = CALLOUT_CONFIG[calloutType]
  return (
    <div className={`border-l-4 ${config.border} ${config.bg} rounded-r-lg p-4 my-4`}>
      <div className="flex gap-3">
        <span className={`material-symbols-outlined ${config.iconColor} text-xl flex-shrink-0 mt-0.5`}>
          {config.icon}
        </span>
        <div className="text-nn-on-surface-variant [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  )
}

// --- Paragraph with image caption detection ---
function Paragraph({ children }: { readonly children: ReactNode }) {
  const childArray = Children.toArray(children)

  const hasImg = childArray.some((c) => isValidElement(c) && c.type === 'img')
  const hasEm = childArray.some((c) => isValidElement(c) && c.type === 'em')

  if (hasImg && hasEm) {
    return (
      <figure className="my-6">
        {childArray.map((child, i) => {
          if (isValidElement(child) && child.type === 'img') {
            return <div key={i}>{child}</div>
          }
          if (isValidElement(child) && child.type === 'em') {
            return (
              <figcaption key={i} className="text-sm text-nn-on-surface-variant mt-2 text-center">
                {(child.props as { children?: ReactNode }).children}
              </figcaption>
            )
          }
          return null
        })}
      </figure>
    )
  }

  if (hasImg && childArray.length === 1) {
    return <div className="my-4">{children}</div>
  }

  return <p className="text-nn-on-surface-variant leading-relaxed mb-4">{children}</p>
}

// --- List item with card-style reference link detection ---
function ListItem({ children }: { readonly children: ReactNode }) {
  const childArray = Children.toArray(children)

  // Detect pattern: <a> followed by text containing " -- description"
  const firstP = childArray.find((c) => isValidElement(c) && c.type === 'p')
  const content = firstP ? (firstP as React.ReactElement<{ children?: ReactNode }>).props.children : children
  const contentArray = Children.toArray(content)

  const anchor = contentArray.find((c) => isValidElement(c) && c.type === 'a')
  if (!anchor || !isValidElement(anchor)) {
    return <li>{children}</li>
  }

  const anchorProps = anchor.props as { href?: string; children?: ReactNode }
  const fullText = contentArray.map(extractText).join('')

  // Check for " -- " separator pattern
  const separatorIdx = fullText.indexOf(' -- ')
  if (separatorIdx === -1) {
    return <li>{children}</li>
  }

  const title = extractText(anchor)
  const description = fullText.slice(separatorIdx + 4).trim()
  const href = anchorProps.href ?? ''

  return (
    <li className="list-none -ml-5">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 p-3 rounded-lg border border-nn-outline-variant/15 bg-nn-surface-container hover:border-nn-primary/30 hover:bg-nn-surface-container-high transition-all my-2 no-underline group"
      >
        <span className="material-symbols-outlined text-nn-primary text-lg flex-shrink-0 mt-0.5">
          open_in_new
        </span>
        <div className="min-w-0">
          <span className="text-nn-primary font-medium group-hover:underline block">{title}</span>
          {description && (
            <span className="text-nn-on-surface-variant text-sm block mt-1">{description}</span>
          )}
        </div>
      </a>
    </li>
  )
}

// --- Component overrides ---
const components: Components = {
  h1: ({ children }) => {
    const text = extractText(children as ReactNode)
    return <h1 id={slugify(text)} className="text-3xl font-bold text-nn-on-surface mt-10 mb-4">{children}</h1>
  },
  h2: ({ children }) => {
    const text = extractText(children as ReactNode)
    return <h2 id={slugify(text)} className="text-2xl font-semibold text-nn-on-surface mt-8 mb-3 scroll-mt-24">{children}</h2>
  },
  h3: ({ children }) => {
    const text = extractText(children as ReactNode)
    return <h3 id={slugify(text)} className="text-xl font-semibold text-nn-on-surface mt-6 mb-2 scroll-mt-24">{children}</h3>
  },
  p: Paragraph as Components['p'],
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-nn-primary hover:underline">
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 mb-4 text-nn-on-surface-variant">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1 mb-4 text-nn-on-surface-variant">{children}</ol>
  ),
  li: ListItem as Components['li'],
  blockquote: Blockquote as Components['blockquote'],
  code: ({ className, children }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 bg-nn-surface-highest rounded text-nn-primary text-sm font-mono">
          {children}
        </code>
      )
    }
    return <code className={`${className} font-mono`}>{children}</code>
  },
  pre: CodeBlock as Components['pre'],
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm text-nn-on-surface-variant">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2 text-left text-nn-on-surface font-semibold border-b border-nn-outline-variant/20">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 border-b border-nn-outline-variant/10">{children}</td>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-nn-on-surface">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-nn-on-surface-variant">{children}</em>
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt ?? ''} loading="lazy" className="rounded-lg my-4 max-w-full" />
  ),
  hr: () => <hr className="my-8 border-nn-outline-variant/15" />,
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
