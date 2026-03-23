import { lazy, Suspense } from 'react'

const MDEditor = lazy(() => import('@uiw/react-md-editor'))

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  height?: number
}

export default function MarkdownEditor({ value, onChange, height = 400 }: MarkdownEditorProps) {
  return (
    <div data-color-mode="dark">
      <Suspense fallback={<div className="h-[400px] bg-nn-surface-lowest rounded-lg animate-pulse" />}>
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={height}
          preview="live"
          visibleDragbar={false}
        />
      </Suspense>
    </div>
  )
}
