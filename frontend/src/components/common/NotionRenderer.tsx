import { useEffect, useRef, useState, useCallback } from 'react'

interface NotionRendererProps {
  pageId: string
  onLoadingChange?: (isLoading: boolean) => void
}

const NotionRenderer = ({ pageId, onLoadingChange }: NotionRendererProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(1500)
  const [isLoaded, setIsLoaded] = useState(false)

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

  const handleIframeLoad = useCallback(() => {
    setIsLoaded(true)
    onLoadingChange?.(false)
  }, [onLoadingChange])

  useEffect(() => {
    setIsLoaded(false)
    onLoadingChange?.(true)
  }, [pageId, onLoadingChange])

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
        className={`w-full border-0 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'transparent',
          height: `${height}px`,
          overflow: 'hidden',
        }}
        scrolling="no"
        allowFullScreen
        onLoad={handleIframeLoad}
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
