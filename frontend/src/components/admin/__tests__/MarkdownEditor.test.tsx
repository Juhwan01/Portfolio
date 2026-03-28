import { describe, it, expect, vi } from 'vitest'
import { render } from '@/test/test-utils'
import MarkdownEditor from '../MarkdownEditor'

vi.mock('@uiw/react-md-editor', () => ({
  default: ({ value, onChange, height }: any) => (
    <textarea
      data-testid="md-editor"
      value={value}
      onChange={(e: any) => onChange(e.target.value)}
      style={{ height }}
    />
  ),
}))

describe('MarkdownEditor', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MarkdownEditor value="test" onChange={() => {}} />
    )
    expect(container).toBeTruthy()
  })

  it('has data-color-mode="dark" wrapper', () => {
    const { container } = render(
      <MarkdownEditor value="test" onChange={() => {}} />
    )
    const wrapper = container.querySelector('[data-color-mode="dark"]')
    expect(wrapper).not.toBeNull()
  })
})
