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
            className="font-label text-secondary tracking-[0.3em] text-sm mb-6 block"
            variants={fadeUp}
          >
            AI/ML Engineer
          </motion.span>
          <motion.h1
            className="font-headline text-6xl md:text-8xl font-black tracking-tighter text-on-surface mb-8 leading-[0.9]"
            variants={fadeUp}
          >
            문제를 정의하고, <br />
            <span className="text-primary">끝까지</span>{' '}
            <span className="text-secondary">해결합니다.</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-on-surface-variant max-w-2xl font-light leading-relaxed"
            variants={fadeUp}
          >
            AI 모델 설계부터 백엔드 개발, 클라우드 배포까지.
            아이디어를 실제 서비스로 만드는 전 과정을 경험했습니다.
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
                Approach
              </h3>
              <div className="space-y-6 text-on-surface-variant text-lg font-light leading-relaxed">
                <p>
                  &ldquo;돌아가기만 하면 끝&rdquo;이 아니라, 왜 이 기술을 선택했는지,
                  어떤 문제를 해결했는지, 정량적으로 얼마나 나아졌는지를 증명합니다.
                </p>
                <p>
                  문제를 정확히 분석하고, 논문과 사례를 근거로 기술을 선택하고,
                  정량적 결과로 검증합니다. 문제 정의부터 프로덕션 배포까지
                  전 과정을 직접 설계하고 구현합니다.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <div className="flex flex-col">
                  <span className="font-label text-secondary text-2xl font-bold">
                    16+
                  </span>
                  <span className="font-label text-xs tracking-widest opacity-60">
                    프로젝트
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
            <h2 className="font-headline text-5xl font-black text-on-surface mb-6 tracking-tighter">
              문제 중심, <br />
              <span className="text-outline-variant">해결 중심.</span>
            </h2>
            <p className="text-on-surface-variant font-light text-lg mb-8">
              기술은 도구일 뿐, 핵심은 문제를 정확히 정의하고
              최적의 해결책을 설계하는 것입니다.
            </p>
            <div className="flex items-center gap-4 text-secondary">
              <span className="material-symbols-outlined">psychology</span>
              <span className="font-label tracking-widest text-sm">
                문제 정의 → 해결 → 검증
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
          Tech Stack
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
              {['Python'].map((tag) => (
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
              {['PyTorch', 'LangGraph', 'LangChain', 'Hugging Face', 'RAG', 'MLflow'].map(
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
                AWS / GCP / Docker Compose
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
                  { name: 'Python', color: 'bg-primary' },
                  { name: 'Docker', color: 'bg-outline' },
                  { name: 'Git', color: 'bg-secondary' },
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

          {/* Database */}
          <motion.div
            className="md:col-span-2 lg:col-span-1 glass-card p-8 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors"
            variants={fadeUp}
          >
            <h4 className="font-headline font-bold text-xl mb-4">
              Database
            </h4>
            <ul className="space-y-2 font-label text-sm text-on-surface-variant">
              <li>&#8226; ChromaDB</li>
              <li>&#8226; OpenSearch</li>
              <li>&#8226; PostgreSQL</li>
            </ul>
          </motion.div>

          {/* Tools */}
          <motion.div
            className="md:col-span-2 lg:col-span-1 glass-card p-8 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors"
            variants={fadeUp}
          >
            <h4 className="font-headline font-bold text-xl mb-4">
              Tools
            </h4>
            <ul className="space-y-2 font-label text-sm text-on-surface-variant">
              <li>&#8226; MCP / Claude Code</li>
              <li>&#8226; GitHub / Jira</li>
              <li>&#8226; Notion</li>
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
          Experience
        </motion.h2>
        <div className="relative max-w-5xl mx-auto">
          {/* Center Line - 모바일: 왼쪽, 데스크탑: 가운데 */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-outline" />

          <div className="space-y-20">
            {/* 인제대학교 */}
            <motion.div
              className="relative pl-12 md:pl-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              {/* Dot */}
              <div className="absolute left-[9px] md:left-1/2 md:-translate-x-[9px] top-2 w-[18px] h-[18px] rounded-full bg-surface border-[3px] border-primary shadow-[0_0_20px_rgba(168,164,255,0.5)] z-10" />
              <div className="md:grid md:grid-cols-2 md:gap-12">
                <div className="md:text-right md:pr-12">
                  <span className="font-label text-primary font-bold text-sm tracking-widest uppercase mb-1 block">
                    2020.03 — 2026.02
                  </span>
                  <h3 className="font-headline text-2xl font-black text-on-surface">
                    인제대학교
                  </h3>
                  <p className="text-secondary font-label text-sm uppercase tracking-wider">
                    컴퓨터공학과 졸업
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:pl-12">
                  <div className="glass-card p-6 rounded-xl border border-outline-variant/10">
                    <p className="text-on-surface-variant font-light mb-4">
                      GPA <strong>4.16/4.5</strong>. 졸업작품 &ldquo;Chef&apos;s Market&rdquo;으로
                      강화학습 기반 개인화 레시피 추천 시스템 개발.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {['Python', 'PyTorch', 'FastAPI'].map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-label px-2 py-0.5 border border-primary/30 rounded text-primary/80 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* IL LAB & Praises Us — 2023.03 */}
            <motion.div
              className="relative pl-12 md:pl-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute left-[9px] md:left-1/2 md:-translate-x-[9px] top-2 w-[18px] h-[18px] rounded-full bg-surface border-[3px] border-outline shadow-[0_0_20px_rgba(118,116,123,0.4)] z-10" />
              <div className="md:grid md:grid-cols-2 md:gap-12">
                <div className="md:text-right md:pr-12 md:order-2 md:text-left md:pl-12">
                  <span className="font-label text-outline font-bold text-sm tracking-widest mb-1 block">
                    2023.03 — 2026.02
                  </span>
                  <h3 className="font-headline text-2xl font-black text-on-surface">
                    IL LAB &amp; Praises Us
                  </h3>
                  <p className="text-secondary font-label text-sm tracking-wider">
                    학부 연구실 &amp; 개발팀
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:order-1 md:pr-12">
                  <div className="glass-card p-6 rounded-xl border border-outline-variant/10">
                    <p className="text-on-surface-variant font-light mb-4">
                      IL LAB <strong>부팀장</strong>으로 AI/ML 연구 및 데이콘 경진대회 참가(상위 9%).
                      Praises Us 개발팀 <strong>팀장</strong>으로 운영하며
                      다수 프로젝트 리딩. W:IDE로 캡스톤 장려상 수상.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {['PyTorch', 'FastAPI', 'Docker', 'AWS'].map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-label px-2 py-0.5 border border-outline/30 rounded text-outline/80 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Leaders — 2024.03 */}
            <motion.div
              className="relative pl-12 md:pl-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute left-[9px] md:left-1/2 md:-translate-x-[9px] top-2 w-[18px] h-[18px] rounded-full bg-surface border-[3px] border-secondary shadow-[0_0_20px_rgba(170,143,253,0.5)] z-10" />
              <div className="md:grid md:grid-cols-2 md:gap-12">
                <div className="md:text-right md:pr-12">
                  <span className="font-label text-secondary font-bold text-sm tracking-widest uppercase mb-1 block">
                    2024.03 — 2024.10
                  </span>
                  <h3 className="font-headline text-2xl font-black text-on-surface">
                    AI Leaders
                  </h3>
                  <p className="text-secondary font-label text-sm uppercase tracking-wider">
                    SW중심대학사업단 AI 리더 양성
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:pl-12">
                  <div className="glass-card p-6 rounded-xl border border-outline-variant/10">
                    <p className="text-on-surface-variant font-light mb-4">
                      생성형 AI 심화 과정. 소수정예 팀 리더로 스터디 및 프로젝트 주도.
                      재정정보 AI 검색 경진대회(4등), 민원누리 SW 경진대회 참가.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {['LangChain', 'NLP', 'Team Lead'].map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-label px-2 py-0.5 border border-secondary/30 rounded text-secondary/80 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* kakao x goorm 부트캠프 — 2025.05 (최신) */}
            <motion.div
              className="relative pl-12 md:pl-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute left-[9px] md:left-1/2 md:-translate-x-[9px] top-2 w-[18px] h-[18px] rounded-full bg-surface border-[3px] border-primary shadow-[0_0_20px_rgba(168,164,255,0.5)] z-10" />
              <div className="md:grid md:grid-cols-2 md:gap-12">
                <div className="md:text-right md:pr-12 md:order-2 md:text-left md:pl-12">
                  <span className="font-label text-primary font-bold text-sm tracking-widest mb-1 block">
                    2025.05 — 2025.11
                  </span>
                  <h3 className="font-headline text-2xl font-black text-on-surface">
                    kakao x goorm
                  </h3>
                  <p className="text-secondary font-label text-sm tracking-wider">
                    생성형 AI 부트캠프
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:order-1 md:pr-12">
                  <div className="glass-card p-6 rounded-xl border border-outline-variant/10">
                    <p className="text-on-surface-variant font-light mb-4">
                      <strong>우수수료생</strong> 선정. 팀 리더로서 AllerGuard(OCR-NLI-RAG),
                      요기어때(<strong>우수프로젝트상</strong>, RAG + 자체 GraphHopper 라우팅 엔진) 등
                      LLM 기반 실전 프로젝트 주도.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {['LangGraph', 'RAG', 'NLI', 'GPT-4'].map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-label px-2 py-0.5 border border-primary/30 rounded text-primary/80 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Beans Pirates — 2026.02 (현재) */}
            <motion.div
              className="relative pl-12 md:pl-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute left-[9px] md:left-1/2 md:-translate-x-[9px] top-2 w-[18px] h-[18px] rounded-full bg-surface border-[3px] border-tertiary shadow-[0_0_20px_rgba(255,157,207,0.5)] z-10" />
              <div className="md:grid md:grid-cols-2 md:gap-12">
                <div className="md:text-right md:pr-12">
                  <span className="font-label text-tertiary font-bold text-sm tracking-widest mb-1 block">
                    2026.02 — 현재
                  </span>
                  <h3 className="font-headline text-2xl font-black text-on-surface">
                    Beans Pirates
                  </h3>
                  <p className="text-secondary font-label text-sm tracking-wider">
                    AI/ML Engineer
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:pl-12">
                  <div className="glass-card p-6 rounded-xl border border-outline-variant/10">
                    <p className="text-on-surface-variant font-light mb-4">
                      AI/ML 엔지니어로 활동 중. LLM 기반 서비스 설계 및 개발, 데이터 파이프라인 구축.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {['AI/ML', 'LangGraph', 'FastAPI'].map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-label px-2 py-0.5 border border-tertiary/30 rounded text-tertiary/80 uppercase"
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
            <h2 className="font-headline text-5xl font-black text-on-surface tracking-tighter">
              Awards &amp; Achievements
            </h2>
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
              2025.11 · kakao x goorm Bootcamp
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
              2024.12 · Capstone Design Competition
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
              Open Source · PyPI
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
              GitHub 저장소
            </a>
          </motion.div>

          <motion.div
            className="glass-card p-8 rounded-xl border-l-4 border-l-outline hover:translate-x-2 transition-transform"
            variants={fadeUp}
          >
            <span className="font-label text-xs text-outline mb-2 block">
              DACON · AI Competition
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
              프로젝트 보기
            </a>
          </motion.div>

          <motion.div
            className="glass-card p-8 rounded-xl border-l-4 border-l-primary hover:translate-x-2 transition-transform"
            variants={fadeUp}
          >
            <span className="font-label text-xs text-outline mb-2 block">
              Production · Full-Stack AI
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
              프로젝트 보기
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
              Contact
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
    </>
  )
}
