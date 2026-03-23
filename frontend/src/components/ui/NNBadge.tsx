import { HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'accent' | 'live'

interface NNBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#25252d] text-[#acaab1]',
  accent: 'bg-[#25252d] text-[#a8a4ff]',
  live: 'bg-[#25252d] text-[#acaab1]',
}

export function NNBadge({ variant = 'default', className = '', children, ...props }: NNBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-medium tracking-wide ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {variant === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff9dcf]" />
      )}
      {children}
    </span>
  )
}
