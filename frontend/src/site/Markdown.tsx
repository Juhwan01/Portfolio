import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { isExternal } from './content'
import { cn } from './ui'

export default function Markdown({ source, className }: { readonly source: string; readonly className?: string }) {
  return (
    <div className={cn('prose max-w-full', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href = '', children }) =>
            isExternal(href) ? (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            ) : href.startsWith('/') ? (
              <Link to={href}>{children}</Link>
            ) : (
              <a href={href}>{children}</a>
            ),
          img: ({ src, alt }) => <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" />,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
