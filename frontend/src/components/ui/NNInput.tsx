import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

const baseClass =
  'w-full px-4 py-3 bg-nn-surface-lowest border border-nn-outline-variant/10 rounded-[4px] text-nn-on-surface placeholder-nn-on-surface-variant/50 focus:outline-none focus:border-nn-primary/40 focus:shadow-[0_0_20px_rgba(168,164,255,0.1)] transition-all'

export const NNInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} className={`${baseClass} ${className}`} {...props} />
  )
)
NNInput.displayName = 'NNInput'

export const NNTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea ref={ref} className={`${baseClass} resize-none ${className}`} {...props} />
  )
)
NNTextarea.displayName = 'NNTextarea'
