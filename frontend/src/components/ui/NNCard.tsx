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
      ? 'nn-card-lift hover:bg-[#1f1f26] border border-transparent hover:border-[#48474d]/20'
      : 'border border-transparent'

    return (
      <div
        ref={ref}
        className={`rounded-2xl ${elevationStyles[elevation]} ${hoverClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

NNCard.displayName = 'NNCard'
