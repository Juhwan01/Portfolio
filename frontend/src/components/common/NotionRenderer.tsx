import { useEffect, useRef, useState } from 'react'

interface NotionRendererProps {
  pageId: string
}

const NotionRenderer = ({ pageId }: NotionRendererProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(1500)

  // Remove hyphens if present and format for embed URL
  const cleanId = pageId.replace(/-/g, '')
  // Use dark theme parameter
  const embedUrl = `https://v2-embednotion.com/${cleanId}?dark=true`

  // Listen for height messages from iframe (if supported)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'resize' && event.data?.height) {
        setHeight(event.data.height)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div
      className="notion-embed-container w-full overflow-hidden"
      style={{
        background: 'transparent',
      }}
    >
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="w-full border-0"
        style={{
          background: 'transparent',
          height: `${height}px`,
          overflow: 'hidden',
        }}
        scrolling="no"
        allowFullScreen
      />
      <style>{`
        .notion-embed-container iframe::-webkit-scrollbar {
          display: none;
        }
        .notion-embed-container iframe {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default NotionRenderer
