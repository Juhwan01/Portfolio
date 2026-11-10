/* UI pieces adapted from the Magic UI portfolio template (MIT) and shadcn/ui — see THIRD_PARTY.md.
   Ported to framer-motion and plain elements so the site needs no new dependencies. */
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type SVGProps,
} from 'react'

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

export const BLUR_FADE_DELAY = 0.04

/** Loads only framer-motion's DOM animation features (much smaller than the full `motion` bundle). */
export function MotionProvider({ children }: { readonly children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>
}

/* ---------- BlurFade ---------- */

export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.4,
  yOffset = 6,
  inView = false,
  blur = '6px',
}: {
  readonly children: ReactNode
  readonly className?: string
  readonly delay?: number
  readonly duration?: number
  readonly yOffset?: number
  readonly inView?: boolean
  readonly blur?: string
}) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, margin: '-50px' })
  const reduceMotion = useReducedMotion()
  const visible = !inView || seen
  if (reduceMotion) return <div className={className}>{children}</div>
  const variants: Variants = {
    hidden: { y: -yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: 'blur(0px)' },
  }
  return (
    <AnimatePresence>
      <m.div
        ref={ref}
        initial="hidden"
        animate={visible ? 'visible' : 'hidden'}
        exit="hidden"
        variants={variants}
        transition={{ delay: 0.04 + delay, duration, ease: 'easeOut' }}
        className={className}
      >
        {children}
      </m.div>
    </AnimatePresence>
  )
}

/* ---------- Badge ---------- */

export function Badge({
  className,
  variant = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { readonly variant?: 'default' | 'secondary' | 'outline' }) {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'text-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

/* ---------- Section divider pill ("My Projects") ---------- */

export function SectionPill({ label }: { readonly label: string }) {
  return (
    <div className="flex items-center w-full">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent from-5% via-border via-95% to-transparent" />
      <div className="border bg-primary z-10 rounded-xl px-4 py-1">
        <span className="text-background text-sm font-medium">{label}</span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent from-5% via-border via-95% to-transparent" />
    </div>
  )
}

/** Round "logo" with the first letters, for entries without an image. */
export function LogoMark({ text, src, className }: { readonly text: string; readonly src?: string; readonly className?: string }) {
  const base = 'size-8 md:size-10 border rounded-full shadow ring-2 ring-border overflow-hidden flex-none bg-card'
  if (src) return <img src={src} alt="" className={cn(base, 'object-cover', className)} />
  return (
    <div className={cn(base, 'flex items-center justify-center text-[11px] md:text-xs font-semibold text-muted-foreground', className)}>
      {text}
    </div>
  )
}

/* ---------- Icons (paths from lucide, ISC; GitHub mark from simple-icons, CC0) ---------- */

type IconProps = SVGProps<SVGSVGElement>
const stroke = (children: ReactNode) =>
  function StrokeIcon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {children}
      </svg>
    )
  }

export const Icons = {
  arrowUpRight: stroke(
    <>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </>,
  ),
  chevronRight: stroke(<path d="m9 18 6-6-6-6" />),
  chevronDown: stroke(<path d="m6 9 6 6 6-6" />),
  chevronLeft: stroke(<path d="m15 18-6-6 6-6" />),
  home: stroke(
    <>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>,
  ),
  book: stroke(
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>,
  ),
  pen: stroke(
    <>
      <path d="M12 20h9" />
      <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
    </>,
  ),
  mail: stroke(
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>,
  ),
  sun: stroke(
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </>,
  ),
  moon: stroke(<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />),
  globe: stroke(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>,
  ),
  phone: stroke(
    <>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </>,
  ),
  play: stroke(<polygon points="6 3 20 12 6 21 6 3" />),
  file: stroke(
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </>,
  ),
  github(props: IconProps) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    )
  },
}

/* ---------- Theme (light by default, like the template) ---------- */

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* storage may be unavailable; the toggle still works for this visit */
    }
    setDark(next)
  }, [])
  return { dark, toggle }
}

/* ---------- Dock (macOS-style magnifying nav) ---------- */

const DockContext = createContext<{ mouseX: MotionValue<number> } | null>(null)

export function Dock({ className, children }: { readonly className?: string; readonly children: ReactNode }) {
  const mouseX = useMotionValue(Infinity)
  return (
    <DockContext.Provider value={{ mouseX }}>
      <m.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn('mx-auto w-max flex items-end justify-center overflow-visible rounded-full border', className)}
      >
        {children}
      </m.div>
    </DockContext.Provider>
  )
}

const SPRING = { mass: 0.1, stiffness: 150, damping: 12 }

export function DockIcon({ className, children }: { readonly className?: string; readonly children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const ctx = useContext(DockContext)
  if (!ctx) throw new Error('DockIcon must be inside Dock')
  const distance = useTransform(ctx.mouseX, (x: number) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return x - b.x - b.width / 2
  })
  const size = useSpring(useTransform(distance, [-100, 0, 100], [40, 60, 40]), SPRING)
  const iconSize = useSpring(useTransform(distance, [-100, 0, 100], [20, 30, 20]), SPRING)
  return (
    <m.div
      ref={ref}
      style={{ width: size, height: size }}
      className={cn('relative flex aspect-square items-center justify-center rounded-full shrink-0', className)}
    >
      <m.div style={{ width: iconSize, height: iconSize }} className="flex items-center justify-center">
        {children}
      </m.div>
    </m.div>
  )
}

/** Hover label above a dock item. */
export function Tip({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <div className="group relative">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground opacity-0 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </div>
  )
}

/* ---------- FlickeringGrid (canvas background) ---------- */

export function FlickeringGrid({
  squareSize = 2,
  gridGap = 2,
  flickerChance = 0.3,
  maxOpacity = 0.3,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  readonly squareSize?: number
  readonly gridGap?: number
  readonly flickerChance?: number
  readonly maxOpacity?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [color, setColor] = useState('rgb(0, 0, 0)')

  // Follow the theme: read the foreground colour now and whenever <html class> changes.
  useEffect(() => {
    const read = () => {
      const el = document.createElement('div')
      el.style.color = 'rgb(var(--foreground))'
      el.style.position = 'absolute'
      el.style.visibility = 'hidden'
      document.body.appendChild(el)
      setColor(getComputedStyle(el).color || 'rgb(0, 0, 0)')
      el.remove()
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const rgbaPrefix = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 1
    const ctx = c.getContext('2d')
    if (!ctx) return 'rgba(0, 0, 0,'
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
    return `rgba(${r}, ${g}, ${b},`
  }, [color])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let frame = 0
    let grid = { cols: 0, rows: 0, squares: new Float32Array(0), dpr: 1 }

    const setup = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      setCanvasSize({ width, height })
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      const cols = Math.floor(width / (squareSize + gridGap))
      const rows = Math.floor(height / (squareSize + gridGap))
      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity
      grid = { cols, rows, squares, dpr }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { cols, rows, squares, dpr } = grid
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          ctx.fillStyle = `${rgbaPrefix}${squares[i * rows + j]})`
          ctx.fillRect(i * (squareSize + gridGap) * dpr, j * (squareSize + gridGap) * dpr, squareSize * dpr, squareSize * dpr)
        }
      }
    }

    setup()
    draw()

    let last = 0
    const animate = (time: number) => {
      const dt = (time - last) / 1000
      last = time
      for (let i = 0; i < grid.squares.length; i++) {
        if (Math.random() < flickerChance * dt) grid.squares[i] = Math.random() * maxOpacity
      }
      draw()
      frame = requestAnimationFrame(animate)
    }

    const resize = new ResizeObserver(() => {
      setup()
      draw()
    })
    resize.observe(container)
    const visibility = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0 })
    visibility.observe(canvas)
    if (isInView && !reduceMotion) frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      visibility.disconnect()
    }
  }, [squareSize, gridGap, flickerChance, maxOpacity, rgbaPrefix, isInView])

  return (
    <div ref={containerRef} className={cn('h-full w-full', className)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  )
}
