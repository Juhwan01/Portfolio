import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Project } from '@/types'

interface ProjectCarouselProps {
  projects: Project[]
}

const ProjectCarousel = ({ projects }: ProjectCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkArrows = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const scrollAmount = carouselRef.current.clientWidth * 0.8
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (projects.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        등록된 프로젝트가 없습니다.
      </div>
    )
  }

  return (
    <div className="relative group/carousel">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className={`absolute left-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-r from-black/80 to-transparent flex items-center justify-center transition-opacity duration-300 ${
          showLeftArrow ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className={`absolute right-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-center transition-opacity duration-300 ${
          showRightArrow ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        onScroll={checkArrows}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-1 py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project, index) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="flex-shrink-0 group"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative w-[280px] md:w-[320px] lg:w-[360px] aspect-[16/10] rounded-lg overflow-hidden bg-gray-900 cursor-pointer"
              whileHover={{ scale: 1.05, zIndex: 10 }}
            >
              {/* Thumbnail */}
              {project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-4xl text-gray-600">{project.title[0]}</span>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Content - Always visible at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg md:text-xl truncate mb-1">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.description}
                </p>
              </div>

              {/* Category Badge - Always visible on hover */}
              {project.category && (
                <span className="absolute top-3 left-3 px-2 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.category}
                </span>
              )}

              {/* Play/View Icon on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40 hover:bg-white/30 transition-colors">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Scrollbar hide style */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ProjectCarousel
