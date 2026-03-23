import { Suspense, lazy, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NNButton } from '@components/ui/NNButton'
import { NNCard } from '@components/ui/NNCard'
import { NNBadge } from '@components/ui/NNBadge'
import { getProjects, getSkills } from '@services/api'
import type { Project, Skill } from '@/types'

const Scene = lazy(() => import('@components/3d/Scene'))

const Hero = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    getProjects({ featured: true })
      .then((data) => setFeaturedProjects(data.slice(0, 3)))
      .catch(() => {})

    getSkills()
      .then((data) => setSkills(data.slice(0, 8)))
      .catch(() => {})
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Glow Orbs */}
        <div className="nn-hero-glow top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
        <div className="nn-hero-glow top-1/3 right-0 translate-x-1/4" style={{ background: 'radial-gradient(circle, rgba(255,157,207,0.1) 0%, transparent 70%)' }} />

        {/* Particle Background */}
        <div className="absolute inset-0 z-0 opacity-50">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 6], fov: 60 }}
              dpr={[1, 1.5]}
              gl={{ antialias: false, alpha: true }}
            >
              <Scene />
            </Canvas>
          </Suspense>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0e0e13]/60 via-transparent to-[#0e0e13]" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.p
              className="nn-label text-[#a8a4ff] mb-6 tracking-[0.2em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              AI Engineer
            </motion.p>

            <h1 className="nn-display text-[#f9f5fd] mb-8">
              Jung{' '}
              <span className="nn-gradient-text">Juhwan</span>
            </h1>

            <p className="text-base md:text-lg text-[#acaab1] mb-12 max-w-xl mx-auto leading-relaxed">
              Building intelligent systems with LLMs, Computer Vision,
              and Advanced ML — turning complex data into elegant solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/projects">
                <NNButton size="lg">View Projects</NNButton>
              </Link>
              <Link to="/contact">
                <NNButton variant="secondary" size="lg">Get in Touch</NNButton>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 border-2 border-[#48474d]/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-[#a8a4ff]/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Section */}
      <section className="relative py-24 px-6 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Section glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-[#48474d]/30 to-transparent" />

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="nn-label text-[#a8a4ff] mb-4">Overview</p>
          <h2 className="nn-headline text-[#f9f5fd]">What I Do</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Featured Projects */}
          {featuredProjects.map((project, i) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <NNCard className="p-0 overflow-hidden group h-full flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#19191f] to-[#25252d] flex items-center justify-center">
                        <span className="text-5xl font-bold text-[#25252d]">{project.title[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131319] via-transparent to-transparent" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      {project.category && (
                        <NNBadge variant="accent">{project.category}</NNBadge>
                      )}
                    </div>
                    <h3 className="text-[#f9f5fd] font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-[#acaab1] text-sm line-clamp-2 flex-1">{project.description}</p>
                  </div>
                </NNCard>
              </motion.div>
            </Link>
          ))}

          {/* Skills Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Link to="/skills" className="h-full block">
              <NNCard className="p-6 h-full flex flex-col justify-between min-h-[240px]">
                <div>
                  <p className="nn-label text-[#ff9dcf] mb-3">Technical Arsenal</p>
                  <h3 className="text-[#f9f5fd] font-semibold text-xl mb-5">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <NNBadge key={skill.id}>{skill.name}</NNBadge>
                    ))}
                  </div>
                </div>
                <p className="text-[#a8a4ff] text-sm mt-6 font-medium">View all skills →</p>
              </NNCard>
            </Link>
          </motion.div>

          {/* About Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Link to="/about" className="h-full block">
              <NNCard className="p-6 h-full flex flex-col justify-between min-h-[240px]">
                <div>
                  <p className="nn-label text-[#ff9dcf] mb-3">The Architect</p>
                  <h3 className="text-[#f9f5fd] font-semibold text-xl mb-4">About Me</h3>
                  <p className="text-[#acaab1] leading-relaxed text-sm">
                    AI Engineer building intelligent systems.
                    Passionate about transforming complex problems into elegant, scalable solutions.
                  </p>
                </div>
                <p className="text-[#a8a4ff] text-sm mt-6 font-medium">Learn more →</p>
              </NNCard>
            </Link>
          </motion.div>

          {/* Contact CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Link to="/contact" className="h-full block">
              <NNCard
                hoverable={false}
                className="p-6 h-full flex flex-col justify-between min-h-[240px] bg-gradient-to-br from-[#665bff] to-[#3713ec] border-none"
              >
                <div>
                  <p className="nn-label text-white/60 mb-3">Collaboration</p>
                  <h3 className="text-white font-semibold text-xl mb-4">Let's Build Together</h3>
                  <p className="text-white/70 leading-relaxed text-sm">
                    Have an AI project in mind? Let's discuss how we can work together.
                  </p>
                </div>
                <p className="text-white text-sm mt-6 font-semibold">Start a conversation →</p>
              </NNCard>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Hero
