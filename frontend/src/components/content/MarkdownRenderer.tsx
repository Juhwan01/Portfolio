import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { Components } from 'react-markdown'

interface MarkdownRendererProps {
  content: string
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-nn-on-surface mt-10 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-nn-on-surface mt-8 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-nn-on-surface mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-nn-on-surface-variant leading-relaxed mb-4">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-nn-primary hover:underline"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 mb-4 text-nn-on-surface-variant">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1 mb-4 text-nn-on-surface-variant">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-nn-primary-dim pl-4 my-4 text-nn-on-surface-variant italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 bg-nn-surface-highest rounded text-nn-primary text-sm font-mono">
          {children}
        </code>
      )
    }
    return (
      <code className={`${className} font-mono`}>
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="bg-nn-surface-lowest rounded-lg p-4 my-4 overflow-x-auto text-sm font-mono">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm text-nn-on-surface-variant">
        {children}
      </table>
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
  img: ({ src, alt }) => (
    <img src={src} alt={alt || ''} className="rounded-lg my-4 max-w-full" />
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
