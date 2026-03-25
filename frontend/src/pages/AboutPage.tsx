import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '@components/common/SEO'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

export default function AboutPage() {
  return (
    <>
    <SEO
      title="About"
      description="AI 엔지니어 정주환의 경험, 기술 스택, 그리고 비전을 소개합니다."
      path="/about"
    />
    <main className="pt-32 pb-20 mesh-gradient-bg min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div
          className="lg:col-span-8"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            className="font-label text-secondary tracking-[0.3em] uppercase text-sm mb-6 block"
            variants={fadeUp}
          >
            AI / Multi-Agent / Full-Stack
          </motion.span>
          <motion.h1
            className="font-headline text-6xl md:text-8xl font-black tracking-tighter text-on-surface mb-8 leading-[0.9]"
            variants={fadeUp}
          >
            Building <span className="text-primary">Intelligent</span>{' '}
            <span className="text-secondary">Systems.</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-on-surface-variant max-w-2xl font-light leading-relaxed"
            variants={fadeUp}
          >
            LLM 기반 Multi-Agent 시스템부터 추천 엔진, 컴퓨터 비전까지 —
            문제를 정의하고, 해결하고, 서빙하는 전 과정을 다룹니다.
          </motion.p>
        </motion.div>
        <motion.div
          className="lg:col-span-4 flex items-end justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative w-full aspect-square max-w-[300px] rounded-xl overflow-hidden border border-outline-variant/20 shadow-2xl">
            <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-outline">
                person
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-8 mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            className="order-2 lg:order-1 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />
            <div className="glass-card p-10 rounded-xl relative z-10">
              <h3 className="font-headline text-3xl font-bold text-on-surface mb-6">
                My Approach
              </h3>
              <div className="space-y-6 text-on-surface-variant text-lg font-light leading-relaxed">
                <p>
                  &ldquo;돌아가기만 하면 끝&rdquo;이 아니라, 왜 이 기술을 선택했는지,
                  어떤 문제를 해결했는지, 정량적으로 얼마나 나아졌는지를 증명합니다.
                </p>
                <p>
                  콜드 스타트 문제를 Q-learning으로 해결하고, Domain Shift를
                  FDA로 극복하고, LLM의 비일관성을 NLI 파이프라인으로 제어하는 것 —
                  문제 정의부터 프로덕션까지의 전 과정을 경험했습니다.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <div className="flex flex-col">
                  <span className="font-label text-secondary text-2xl font-bold">
                    16+
                  </span>
                  <span className="font-label text-xs uppercase tracking-widest opacity-60">
                    Projects
                  </span>
                </div>
                <div className="w-px h-12 bg-outline-variant/30" />
                <div className="flex flex-col">
                  <span className="font-label text-primary text-2xl font-bold">
                    11.7x
                  </span>
                  <span className="font-label text-xs uppercase tracking-widest opacity-60">
                    vs Random (RecSys)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="order-1 lg:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-headline text-5xl font-black text-on-surface mb-6 uppercase tracking-tighter">
              Problem First, <br />
              <span className="text-outline-variant">Code Second.</span>
            </h2>
            <p className="text-on-surface-variant font-light text-lg mb-8">
              기술은 도구일 뿐, 핵심은 문제를 정확히 정의하고
              최적의 해결책을 설계하는 것입니다.
            </p>
            <div className="flex items-center gap-4 text-secondary">
              <span className="material-symbols-outlined">psychology</span>
              <span className="font-label tracking-widest uppercase text-sm">
                Problem-Driven Engineering
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Toolkit */}
      <section className="max-w-7xl mx-auto px-8 mb-40">
        <motion.h2
          className="font-label text-sm tracking-[0.4em] uppercase text-outline-variant mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Technical Toolkit
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          {/* Core Languages */}
          <motion.div
            className="md:col-span-2 lg:col-span-2 glass-card p-8 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors"
            variants={fadeUp}
          >
            <div>
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">
                code
              </span>
              <h4 className="font-headline font-bold text-xl mb-2">
                Languages
              </h4>
              <p className="text-on-surface-variant text-sm font-light">
                AI 시스템의 기반이 되는 언어들
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {['Python', 'TypeScript', 'JavaScript', 'SQL'].map((tag) => (
                <span
                  key={tag}
                  className="bg-surface-container-highest px-3 py-1 rounded-md text-xs font-label text-on-surface"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* AI / ML */}
          <motion.div
            className="md:col-span-2 lg:col-span-3 glass-card p-8 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors"
            variants={fadeUp}
          >
            <div>
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl">
                neurology
              </span>
              <h4 className="font-headline font-bold text-xl mb-2">
                AI / ML
              </h4>
              <p className="text-on-surface-variant text-sm font-light">
                모델 학습부터 LLM 에이전트 오케스트레이션까지
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {['PyTorch', 'LangGraph', 'LangChain', 'scikit-learn', 'XGBoost', 'Hugging Face'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="bg-surface-container-highest px-3 py-1 rounded-md text-xs font-label text-on-surface"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </motion.div>

          {/* Cloud */}
          <motion.div
            className="md:col-span-4 lg:col-span-1 glass-card p-8 rounded-xl flex lg:flex-col justify-between items-center lg:items-start group hover:bg-surface-container-high transition-colors"
            variants={fadeUp}
          >
            <span className="material-symbols-outlined text-outline mb-4 text-3xl">
              cloud
            </span>
            <div className="text-right lg:text-left">
              <h4 className="font-headline font-bold text-xl">Cloud</h4>
              <p className="text-on-surface-variant text-xs mt-1">
                AWS / GCP
              </p>
            </div>
          </motion.div>

          {/* Backend & DevOps */}
          <motion.div
            className="md:col-span-2 lg:col-span-4 glass-card p-8 rounded-xl relative overflow-hidden group hover:bg-surface-container-high transition-colors"
            variants={fadeUp}
          >
            <div className="relative z-10">
              <h4 className="font-headline font-bold text-xl mb-4">
                Backend &amp; DevOps
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'FastAPI', color: 'bg-secondary' },
                  { name: 'Docker', color: 'bg-primary' },
                  { name: 'Nginx', color: 'bg-outline' },
                  { name: 'PostgreSQL', color: 'bg-secondary' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="font-label text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">
                hub
              </span>
            </div>
          </motion.div>

          {/* Data & Frontend */}
          <motion.div
            className="md:col-span-2 lg:col-span-2 glass-card p-8 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors"
            variants={fadeUp}
          >
            <h4 className="font-headline font-bold text-xl mb-4">
              Frontend &amp; Data
            </h4>
            <ul className="space-y-2 font-label text-sm text-on-surface-variant">
              <li>&#8226; React / Tailwind CSS</li>
              <li>&#8226; ChromaDB / OpenSearch</li>
              <li>&#8226; Streamlit / Gradio</li>
              <li>&#8226; Three.js / Vite</li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* Experience Timeline */}
      <section className="max-w-7xl mx-auto px-8 mb-40">
        <motion.h2
          className="font-headline text-5xl font-black text-on-surface mb-20 uppercase tracking-tighter text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Experience <span className="text-primary">Timeline.</span>
        </motion.h2>
        <div className="relative border-l-2 border-outline-variant/20 ml-4 md:ml-0 md:left-1/2 md:-translate-x-px space-y-24">
          {/* kakao x goorm AI 부트캠프 */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -left-[9px] md:left-1/2 md:-translate-x-[9px] w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(168,164,255,0.6)] z-20" />
            <div className="md:flex items-center justify-between w-full">
              <div className="md:w-5/12 ml-10 md:ml-0 md:pr-12 text-left md:text-right">
                <span className="font-label text-primary font-bold text-sm tracking-widest uppercase mb-2 block">
                  2025.05 — 2025.11
                </span>
                <h3 className="font-headline text-2xl font-black text-on-surface">
                  AI 부트캠프
                </h3>
                <p className="text-secondary font-label text-sm uppercase tracking-wider mb-4">
                  kakao x goorm
                </p>
              </div>
              <div className="md:w-5/12 ml-10 md:ml-0 md:pl-12 mt-4 md:mt-0">
                <div className="glass-card p-6 rounded-xl">
                  <p className="text-on-surface-variant font-light mb-4">
                    <strong>우수수료생</strong> 선정. 팀 리더로서 AllerGuard(OCR-NLI-RAG),
                    요기어때(<strong>우수프로젝트상</strong>, RAG + 자체 라우팅 엔진) 등
                    LLM 기반 실전 프로젝트를 주도.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {['LangGraph', 'RAG', 'GPT-4'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-label px-2 py-0.5 border border-outline-variant/30 rounded text-outline uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Leaders */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute -left-[9px] md:left-1/2 md:-translate-x-[9px] w-4 h-4 rounded-full bg-secondary shadow-[0_0_15px_rgba(170,143,253,0.6)] z-20" />
            <div className="md:flex items-center justify-between w-full flex-row-reverse">
              <div className="md:w-5/12 ml-10 md:ml-0 md:pl-12 text-left">
                <span className="font-label text-secondary font-bold text-sm tracking-widest uppercase mb-2 block">
                  2024.03 — 2024.10
                </span>
                <h3 className="font-headline text-2xl font-black text-on-surface">
                  AI Leaders
                </h3>
                <p className="text-primary font-label text-sm uppercase tracking-wider mb-4">
                  SW중심대학사업단 AI 리더 양성
                </p>
              </div>
              <div className="md:w-5/12 ml-10 md:ml-0 md:pr-12 mt-4 md:mt-0">
                <div className="glass-card p-6 rounded-xl">
                  <p className="text-on-surface-variant font-light mb-4">
                    ML/DL 심화 과정 이수. PyTorch 기반 모델 학습부터
                    경진대회 참여까지 실전 경험. Chef&apos;s Market 추천 시스템,
                    W:IDE AI 코드 에디터 등 팀 프로젝트 리딩.
                  </p>
                  <div className="flex gap-2 flex-wrap md:justify-end">
                    {['PyTorch', 'FastAPI', 'Team Lead'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-label px-2 py-0.5 border border-outline-variant/30 rounded text-outline uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* IL LAB & P&N */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute -left-[9px] md:left-1/2 md:-translate-x-[9px] w-4 h-4 rounded-full bg-outline shadow-[0_0_15px_rgba(118,116,123,0.6)] z-20" />
            <div className="md:flex items-center justify-between w-full">
              <div className="md:w-5/12 ml-10 md:ml-0 md:pr-12 text-left md:text-right">
                <span className="font-label text-outline font-bold text-sm tracking-widest uppercase mb-2 block">
                  2023.03 — 2026.02
                </span>
                <h3 className="font-headline text-2xl font-black text-on-surface">
                  IL LAB &amp; Praises Us
                </h3>
                <p className="text-secondary font-label text-sm uppercase tracking-wider mb-4">
                  학부 연구실 &amp; 개발팀
                </p>
              </div>
              <div className="md:w-5/12 ml-10 md:ml-0 md:pl-12 mt-4 md:mt-0">
                <div className="glass-card p-6 rounded-xl">
                  <p className="text-on-surface-variant font-light mb-4">
                    IL LAB <strong>부팀장</strong>으로 AI/ML 연구 및 데이콘 경진대회 참가.
                    Praises Us 개발팀 <strong>팀장</strong>으로 운영하며
                    다수 프로젝트 리딩. W:IDE로 캡스톤 장려상 수상.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {['Research', 'Team Lead', 'Capstone'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-label px-2 py-0.5 border border-outline-variant/30 rounded text-outline uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recognition */}
      <section className="max-w-7xl mx-auto px-8 mb-40">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="font-headline text-5xl font-black text-on-surface uppercase tracking-tighter">
              Recognition.
            </h2>
            <p className="text-on-surface-variant font-light text-lg mt-2">
              Awards &amp; Open Source Contributions
            </p>
          </div>
          <a
            href="https://github.com/Juhwan01"
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-xs tracking-widest uppercase text-primary hover:text-secondary transition-colors flex items-center gap-2"
          >
            View GitHub{' '}
            <span className="material-symbols-outlined text-sm">
              open_in_new
            </span>
          </a>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          <motion.div
            className="glass-card p-8 rounded-xl border-l-4 border-l-primary hover:translate-x-2 transition-transform"
            variants={fadeUp}
          >
            <span className="font-label text-xs text-outline mb-2 block">
              2025.11 — kakao x goorm 부트캠프
            </span>
            <h4 className="font-headline font-bold text-xl mb-3 text-on-surface">
              우수수료생 &amp; 우수프로젝트상
            </h4>
            <p className="text-on-surface-variant text-sm font-light mb-4">
              6개월 생성형 AI 과정에서 <strong>우수수료생</strong>으로 선정.
              팀 리더로 개발한 &ldquo;요기어때&rdquo;가 <strong>우수프로젝트상</strong> 수상.
              RAG + 자체 GraphHopper 라우팅 엔진으로 이동 편의성 기반 추천 구현.
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-8 rounded-xl border-l-4 border-l-secondary hover:translate-x-2 transition-transform"
            variants={fadeUp}
          >
            <span className="font-label text-xs text-outline mb-2 block">
              2024.12 — Competition Award
            </span>
            <h4 className="font-headline font-bold text-xl mb-3 text-on-surface">
              INJE 캡스톤디자인 경진대회 장려상
            </h4>
            <p className="text-on-surface-variant text-sm font-light mb-4">
              LangGraph 기반 AI 코드 에디터 &ldquo;W:IDE&rdquo; 개발.
              Electron IPC 아키텍처로 브라우저 샌드박스 제약을 극복한 점이 높게 평가됨.
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-8 rounded-xl border-l-4 border-l-outline hover:translate-x-2 transition-transform"
            variants={fadeUp}
          >
            <span className="font-label text-xs text-outline mb-2 block">
              Open Source — PyPI Published
            </span>
            <h4 className="font-headline font-bold text-xl mb-3 text-on-surface">
              Jira Extended MCP Server
            </h4>
            <p className="text-on-surface-variant text-sm font-light mb-4">
              AI 에이전트를 위한 풀스택 Jira Cloud 통합 MCP 서버.
              27개 도구, 벌크 작업, 릴리스 관리 지원. PyPI에 배포.
            </p>
            <a
              className="inline-flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest"
              href="https://github.com/Juhwan01/jira-extended-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
          </motion.div>

          <motion.div
            className="glass-card p-8 rounded-xl border-l-4 border-l-outline hover:translate-x-2 transition-transform"
            variants={fadeUp}
          >
            <span className="font-label text-xs text-outline mb-2 block">
              DACON — AI Competition
            </span>
            <h4 className="font-headline font-bold text-xl mb-3 text-on-surface">
              구조물 안정성 물리 추론 AI 경진대회
            </h4>
            <p className="text-on-surface-variant text-sm font-light mb-4">
              Dual-Stream ConvNeXt-V2 + FDA Domain Adaptation으로
              Train/Test 간 Domain Shift 문제를 해결.
            </p>
            <a
              className="inline-flex items-center gap-2 text-outline text-xs font-bold uppercase tracking-widest"
              href="https://github.com/Juhwan01/structural-stability-prediction"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project
            </a>
          </motion.div>

          <motion.div
            className="glass-card p-8 rounded-xl border-l-4 border-l-primary hover:translate-x-2 transition-transform"
            variants={fadeUp}
          >
            <span className="font-label text-xs text-outline mb-2 block">
              Production — Full-Stack AI
            </span>
            <h4 className="font-headline font-bold text-xl mb-3 text-on-surface">
              SAiM RecSys: Hit@10 70.6%
            </h4>
            <p className="text-on-surface-variant text-sm font-light mb-4">
              LinUCB Contextual Bandit 기반 운동 추천 엔진.
              Random 대비 11.7배 성능, 123개 테스트 전체 통과, Docker 배포.
            </p>
            <a
              className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest"
              href="https://github.com/Juhwan01/SAiM-RecSys"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <motion.div
          className="inline-block relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <h2 className="font-headline text-4xl font-black text-on-surface mb-8">
              함께 만들어갈{' '}
              <span className="text-secondary italic">프로젝트</span>가 있나요?
            </h2>
            <Link
              to="/contact"
              className="inline-block bg-primary text-on-primary font-headline font-extrabold text-lg px-12 py-5 rounded-full hover:scale-110 transition-transform active:scale-95 shadow-xl"
            >
              Contact Me
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
    </>
  )
}
