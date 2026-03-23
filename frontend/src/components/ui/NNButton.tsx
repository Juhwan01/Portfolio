import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'tertiary'
type Size = 'sm' | 'md' | 'lg'

interface NNButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-[#665bff] to-[#a8a4ff] text-white font-semibold shadow-[0_0_20px_rgba(102,91,255,0.4)] hover:shadow-[0_0_30px_rgba(102,91,255,0.6)] hover:brightness-110 transition-all',
  secondary:
    'bg-transparent border border-[#48474d]/30 text-[#a8a4ff] hover:border-[#a8a4ff]/40 hover:bg-[#a8a4ff]/5 transition-all',
  tertiary:
    'bg-transparent text-[#acaab1] hover:text-[#f9f5fd] transition-colors',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-2.5 text-sm rounded-lg',
  lg: 'px-8 py-3 text-base rounded-lg',
}

export const NNButton = forwardRef<HTMLButtonElement, NNButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center cursor-pointer font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

NNButton.displayName = 'NNButton'
