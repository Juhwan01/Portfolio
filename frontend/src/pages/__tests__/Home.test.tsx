import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { render } from '@/test/test-utils'
import Home from '@pages/Home'
import { server } from '@/test/mocks/server'

vi.mock('@components/3d/Scene', () => ({
  default: () => <div data-testid="scene">Scene</div>,
}))

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Float: ({ children }: any) => children,
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Home', () => {
  it('renders without crashing', () => {
    const { container } = render(<Home />)
    expect(container).toBeTruthy()
  })

  it('renders the hero heading', () => {
    const { getByText } = render(<Home />)
    expect(getByText('Jung Juhwan')).toBeInTheDocument()
  })
})
