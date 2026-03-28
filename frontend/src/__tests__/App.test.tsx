import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import App from '@/App'

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

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const filtered = { ...props }
      const motionKeys = [
        'initial', 'animate', 'exit', 'variants', 'transition',
        'whileInView', 'viewport', 'whileHover', 'whileTap',
      ]
      for (const key of motionKeys) delete filtered[key]
      return <div {...filtered}>{children}</div>
    },
    h1: ({ children, ...props }: any) => <h1>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3>{children}</h3>,
    p: ({ children, ...props }: any) => <p>{children}</p>,
    span: ({ children, ...props }: any) => <span>{children}</span>,
    section: ({ children, ...props }: any) => <section>{children}</section>,
    article: ({ children, ...props }: any) => <article>{children}</article>,
    a: ({ children, ...props }: any) => <a>{children}</a>,
    img: (props: any) => <img />,
    ul: ({ children, ...props }: any) => <ul>{children}</ul>,
    li: ({ children, ...props }: any) => <li>{children}</li>,
    nav: ({ children, ...props }: any) => <nav>{children}</nav>,
    button: ({ children, ...props }: any) => <button>{children}</button>,
    form: ({ children, ...props }: any) => <form>{children}</form>,
    input: (props: any) => <input />,
    textarea: (props: any) => <textarea />,
    header: ({ children, ...props }: any) => <header>{children}</header>,
    footer: ({ children, ...props }: any) => <footer>{children}</footer>,
    main: ({ children, ...props }: any) => <main>{children}</main>,
  },
  AnimatePresence: ({ children }: any) => children,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => 0,
  useMotionValue: () => ({ get: () => 0, set: () => {} }),
  useSpring: () => ({ get: () => 0 }),
}))

vi.mock('@components/sections/Hero', () => ({
  default: () => <div data-testid="hero">Hero</div>,
}))

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    )
    expect(container).toBeTruthy()
  })
})
