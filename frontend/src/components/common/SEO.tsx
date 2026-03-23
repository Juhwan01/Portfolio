import { Helmet } from 'react-helmet-async'

const SITE_NAME = '정주환 | AI Engineer Portfolio'
const SITE_URL = 'https://juhwan.dev'
const DEFAULT_DESCRIPTION =
  'AI 엔지니어 정주환의 포트폴리오. React, FastAPI, Three.js로 구축한 프로젝트와 기술 블로그를 확인하세요.'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

interface SEOProps {
  readonly title?: string
  readonly description?: string
  readonly image?: string
  readonly path?: string
  readonly type?: 'website' | 'article'
  readonly noindex?: boolean
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  path = '',
  type = 'website',
  noindex = false,
}: SEOProps) {
  const pageTitle = title ? `${title} | 정주환` : SITE_NAME
  const url = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="정주환 포트폴리오" />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
