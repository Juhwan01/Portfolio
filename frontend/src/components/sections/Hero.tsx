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
        {/* Particle Background */}
        <div className="absolute inset-0 z-0 opacity-60">
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
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-nn-bg/50 via-transparent to-nn-bg" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="nn-label text-nn-primary mb-4">AI Engineer</p>
            <h1 className="nn-display text-nn-on-surface mb-6">
              Jung <span className="nn-gradient-text">Juhwan</span>
            </h1>
            <p className="text-lg md:text-xl text-nn-on-surface-variant mb-10 max-w-2xl mx-auto leading-relaxed">
              Building intelligent systems with LLMs, Computer Vision, and Advanced ML.
              Turning complex data into elegant solutions.
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-nn-outline-variant/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-nn-on-surface-variant/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured Projects */}
          {featuredProjects.map((project, i) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <NNCard className="p-0 overflow-hidden group h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-nn-surface-container to-nn-surface-highest flex items-center justify-center">
                        <span className="text-4xl text-nn-on-surface-variant/30">{project.title[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-nn-bg via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {project.category && (
                        <NNBadge variant="accent">{project.category}</NNBadge>
                      )}
                    </div>
                    <h3 className="text-nn-on-surface font-semibold text-lg mb-1">{project.title}</h3>
                    <p className="text-nn-on-surface-variant text-sm line-clamp-2">{project.description}</p>
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
          >
            <Link to="/skills">
              <NNCard className="p-6 h-full flex flex-col justify-between">
                <div>
                  <p className="nn-label text-nn-tertiary mb-3">Technical Arsenal</p>
                  <h3 className="nn-headline text-nn-on-surface mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <NNBadge key={skill.id}>{skill.name}</NNBadge>
                    ))}
                  </div>
                </div>
                <p className="text-nn-primary text-sm mt-4">View all skills →</p>
              </NNCard>
            </Link>
          </motion.div>

          {/* About Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/about">
              <NNCard className="p-6 h-full flex flex-col justify-between">
                <div>
                  <p className="nn-label text-nn-tertiary mb-3">The Architect</p>
                  <h3 className="nn-headline text-nn-on-surface mb-4">About Me</h3>
                  <p className="text-nn-on-surface-variant leading-relaxed">
                    AI Engineer building intelligent systems.
                    Passionate about transforming complex problems into elegant, scalable solutions.
                  </p>
                </div>
                <p className="text-nn-primary text-sm mt-4">Learn more →</p>
              </NNCard>
            </Link>
          </motion.div>

          {/* Contact CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/contact">
              <NNCard className="p-6 h-full flex flex-col justify-between nn-gradient-primary">
                <div>
                  <p className="nn-label text-white/70 mb-3">Collaboration</p>
                  <h3 className="nn-headline text-white mb-4">Let's Build Together</h3>
                  <p className="text-white/80 leading-relaxed">
                    Have an AI project in mind? Let's discuss how we can work together.
                  </p>
                </div>
                <p className="text-white text-sm mt-4 font-semibold">Start a conversation →</p>
              </NNCard>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Hero
