import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

const Card = ({ children, className = '', hover = true }: CardProps) => {
  return (
    <div
      className={`glass rounded-lg p-6 ${
        hover ? 'hover:bg-white/15 transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
