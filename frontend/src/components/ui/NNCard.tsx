import { HTMLAttributes, forwardRef } from 'react'

type Elevation = 'low' | 'base' | 'high'

interface NNCardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation
  hoverable?: boolean
}

const elevationStyles: Record<Elevation, string> = {
  low: 'bg-[#131319]',
  base: 'bg-[#19191f]',
  high: 'bg-[#1f1f26]',
}

export const NNCard = forwardRef<HTMLDivElement, NNCardProps>(
  ({ elevation = 'low', hoverable = true, className = '', children, ...props }, ref) => {
    const hoverClass = hoverable
      ? 'hover:bg-[#1f1f26] hover:shadow-[0_0_40px_rgba(168,164,255,0.08)] transition-all duration-300'
      : ''

    return (
      <div
        ref={ref}
        className={`rounded-xl ${elevationStyles[elevation]} ${hoverClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

NNCard.displayName = 'NNCard'
