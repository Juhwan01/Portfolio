export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export function extractHeadings(markdown: string): readonly TocItem[] {
  const headings: TocItem[] = []
  const regex = /^(#{2,3})\s+(.+)$/gm
  let match

  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length as 2 | 3
    const text = match[2].replace(/\*\*/g, '').replace(/`/g, '').trim()
    headings.push({
      id: slugify(text),
      text,
      level,
    })
  }

  return headings
}
