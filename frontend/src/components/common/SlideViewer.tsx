interface SlideViewerProps {
  url: string
  title?: string
}

const SlideViewer = ({ url, title = 'Presentation' }: SlideViewerProps) => {
  // Google Slides URL을 embed URL로 변환
  const getEmbedUrl = (inputUrl: string) => {
    // 이미 embed URL인 경우
    if (inputUrl.includes('/embed')) {
      return inputUrl
    }

    // Google Slides 공유 URL을 embed URL로 변환
    // https://docs.google.com/presentation/d/PRESENTATION_ID/edit?usp=sharing
    // → https://docs.google.com/presentation/d/PRESENTATION_ID/embed
    const match = inputUrl.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/)
    if (match) {
      return `https://docs.google.com/presentation/d/${match[1]}/embed?start=false&loop=false&delayms=3000`
    }

    // 변환 불가능한 경우 원본 반환
    return inputUrl
  }

  if (!url) return null

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
      <div className="aspect-[16/9] rounded-lg overflow-hidden bg-black/20">
        <iframe
          src={getEmbedUrl(url)}
          className="w-full h-full"
          allowFullScreen
          style={{ border: 0 }}
        />
      </div>
    </div>
  )
}

export default SlideViewer
