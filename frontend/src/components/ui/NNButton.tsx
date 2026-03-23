import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'tertiary'
type Size = 'sm' | 'md' | 'lg'

interface NNButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantStyles: Record<Variant, string> = {
  primary:
    'nn-gradient-primary text-[#000000] font-semibold hover:opacity-90 transition-opacity',
  secondary:
    'bg-transparent nn-ghost-border text-[#a8a4ff] hover:nn-ghost-border-hover transition-colors',
  tertiary:
    'bg-transparent text-[#acaab1] hover:text-[#f9f5fd] transition-colors',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
}

export const NNButton = forwardRef<HTMLButtonElement, NNButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-[4px] cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

NNButton.displayName = 'NNButton'
