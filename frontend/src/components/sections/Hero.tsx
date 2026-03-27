import { Suspense, lazy, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Link } from 'react-router-dom'
import { getProjects, getSkills } from '@services/api'
import type { Project, Skill } from '@/types'

const Scene = lazy(() => import('@components/3d/Scene'))

const Hero = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    getProjects({ featured: true })
      .then((data) => setFeaturedProjects(data.slice(0, 2)))
      .catch(() => {})

    getSkills()
      .then((data) => setSkills(data.slice(0, 5)))
      .catch(() => {})
  }, [])

  return (
    <>
      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Neural Network Visualization */}
        <div className="absolute inset-0 z-0 neural-gradient opacity-60" />
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

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-on-background mb-4">
            Jung Juhwan
          </h1>
          <p className="text-xl md:text-2xl font-medium text-on-surface-variant tracking-wide mb-10">
            AI/ML Engineer
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              to="/projects"
              className="px-8 py-4 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed rounded-md font-bold text-lg shadow-[0_0_30px_rgba(55,19,236,0.3)] hover:brightness-110 transition-all"
            >
              프로젝트 보기
            </Link>
            <Link
              to="/blog"
              className="px-8 py-4 border border-outline-variant/30 text-on-surface rounded-md font-bold text-lg hover:bg-surface-container-high transition-all"
            >
              기술 블로그
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <span className="material-symbols-outlined text-3xl">expand_more</span>
        </div>
      </main>

      {/* Bento Grid Content */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-surface">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6">
          {/* Featured Project 1 (Large) */}
          {featuredProjects[0] && (
            <Link
              to={`/projects/${featuredProjects[0].id}`}
              className="md:col-span-2 md:row-span-2 rounded-xl bg-surface-container-low overflow-hidden group border border-transparent hover:border-outline-variant/20 transition-all"
            >
              <div className="h-2/3 bg-surface-container-highest relative overflow-hidden">
                {featuredProjects[0].thumbnailUrl ? (
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                    src={featuredProjects[0].thumbnailUrl}
                    alt={featuredProjects[0].title}
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-highest" />
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  {featuredProjects[0].category && (
                    <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold uppercase tracking-widest text-primary rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                      {featuredProjects[0].category}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{featuredProjects[0].title}</h3>
                <p className="text-on-surface-variant mb-4">{featuredProjects[0].description}</p>
                <div className="flex gap-2">
                  {featuredProjects[0].techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-surface-container-highest text-[10px] font-bold uppercase tracking-tighter rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          )}
          {!featuredProjects[0] && (
            <div className="md:col-span-2 md:row-span-2 rounded-xl bg-surface-container-low overflow-hidden border border-transparent">
              <div className="h-2/3 bg-surface-container-highest" />
              <div className="p-8">
                <div className="h-6 w-48 bg-surface-container-highest rounded mb-2 animate-pulse" />
                <div className="h-4 w-full bg-surface-container-highest rounded animate-pulse" />
              </div>
            </div>
          )}

          {/* Skills Card */}
          <Link
            to="/skills"
            className="rounded-xl bg-surface-container-low p-8 border border-transparent hover:border-outline-variant/20 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="material-symbols-outlined text-primary mb-4">memory</span>
              <h3 className="text-xl font-bold mb-4">핵심 기술</h3>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0
                  ? skills.map((skill) => (
                      <span key={skill.id} className="px-3 py-1 bg-surface-container-highest text-[11px] font-bold rounded uppercase tracking-widest">
                        {skill.name}
                      </span>
                    ))
                  : ['PyTorch', 'LangChain', 'Python', 'Docker'].map((name) => (
                      <span key={name} className="px-3 py-1 bg-surface-container-highest text-[11px] font-bold rounded uppercase tracking-widest">
                        {name}
                      </span>
                    ))
                }
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-outline-variant/10">
              <p className="text-xs text-on-surface-variant tracking-widest font-bold">현재 관심 분야</p>
              <p className="text-sm font-medium">Multi-Agent 시스템 &amp; RAG</p>
            </div>
          </Link>

          {/* Github Stats Card */}
          <div className="rounded-xl bg-surface-container-lowest p-8 border border-outline-variant/15 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-4xl mb-2 text-on-surface">monitoring</span>
            <div className="text-4xl font-black text-primary mb-1">1.2k+</div>
            <div className="text-sm font-bold tracking-widest text-on-surface-variant">GitHub 기여</div>
            <div className="mt-6 w-full flex justify-between gap-1 opacity-40">
              <div className="h-8 flex-1 bg-primary/20 rounded-sm" />
              <div className="h-12 flex-1 bg-primary/40 rounded-sm" />
              <div className="h-10 flex-1 bg-primary/60 rounded-sm" />
              <div className="h-14 flex-1 bg-primary rounded-sm" />
              <div className="h-6 flex-1 bg-primary/20 rounded-sm" />
            </div>
          </div>

          {/* About Snippet */}
          <Link
            to="/about"
            className="rounded-xl bg-surface-container-low p-8 border border-transparent hover:border-outline-variant/20 transition-all"
          >
            <h3 className="text-xl font-bold mb-4">소개</h3>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              문제를 정의하고, AI로 해결하고, 프로덕션까지 서빙하는 전 과정을 다루는 엔지니어입니다.
            </p>
            <span className="text-primary text-sm font-bold tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
              자세히 보기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </Link>

          {/* Featured Project 2 */}
          {featuredProjects[1] && (
            <Link
              to={`/projects/${featuredProjects[1].id}`}
              className="md:col-span-2 rounded-xl bg-surface-container-low overflow-hidden group border border-transparent hover:border-outline-variant/20 transition-all flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 h-48 md:h-auto bg-surface-container-highest relative">
                {featuredProjects[1].thumbnailUrl ? (
                  <img
                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                    src={featuredProjects[1].thumbnailUrl}
                    alt={featuredProjects[1].title}
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-highest" />
                )}
              </div>
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-2">{featuredProjects[1].title}</h3>
                <p className="text-on-surface-variant text-sm mb-4">{featuredProjects[1].description}</p>
                <div className="flex gap-2">
                  {featuredProjects[1].techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-surface-container-highest text-[10px] font-bold uppercase tracking-tighter rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          )}
          {!featuredProjects[1] && (
            <div className="md:col-span-2 rounded-xl bg-surface-container-low overflow-hidden border border-transparent flex flex-col md:flex-row">
              <div className="md:w-1/2 h-48 md:h-auto bg-surface-container-highest" />
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <div className="h-6 w-40 bg-surface-container-highest rounded mb-2 animate-pulse" />
                <div className="h-4 w-full bg-surface-container-highest rounded animate-pulse" />
              </div>
            </div>
          )}

          {/* Contact Card */}
          <Link
            to="/contact"
            className="md:col-span-3 rounded-xl bg-gradient-to-r from-surface-container-low to-surface-container-high p-8 flex flex-col md:flex-row justify-between items-center gap-8 border border-outline-variant/10"
          >
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-1">함께 할 프로젝트가 있으신가요?</h3>
              <p className="text-on-surface-variant">AI 프로젝트 협업, 채용 문의 등 편하게 연락해 주세요.</p>
            </div>
            <span className="w-full md:w-auto px-10 py-4 bg-on-background text-surface font-black tracking-widest rounded-md hover:bg-primary transition-colors text-center">
              연락하기
            </span>
          </Link>
        </div>
      </section>
    </>
  )
}

export default Hero
