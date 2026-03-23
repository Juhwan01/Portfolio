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
      description="AI 엔지니어 정주환의 경력, 기술 스택, 그리고 비전을 소개합니다."
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
            Architecture / Engineering / Intelligence
          </motion.span>
          <motion.h1
            className="font-headline text-6xl md:text-8xl font-black tracking-tighter text-on-surface mb-8 leading-[0.9]"
            variants={fadeUp}
          >
            Bridging <span className="text-primary">Logic</span> &{' '}
            <span className="text-secondary">Autonomy.</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-on-surface-variant max-w-2xl font-light leading-relaxed"
            variants={fadeUp}
          >
            I design and implement reliable AI systems that prioritize structural
            integrity and ethical scalability. My work transforms complex neural
            architectures into robust production environments.
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
                The Philosophy
              </h3>
              <div className="space-y-6 text-on-surface-variant text-lg font-light leading-relaxed">
                <p>
                  Reliability is not an afterthought; it is the foundation. In
                  the realm of AI, &apos;working&apos; isn&apos;t enough—systems
                  must be predictable, observable, and resilient.
                </p>
                <p>
                  My approach treats code as architecture. Every layer must
                  support the one above it, ensuring that as models grow in
                  complexity, the infrastructure remains immutable.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <div className="flex flex-col">
                  <span className="font-label text-secondary text-2xl font-bold">
                    99.9%
                  </span>
                  <span className="font-label text-xs uppercase tracking-widest opacity-60">
                    Uptime Driven
                  </span>
                </div>
                <div className="w-px h-12 bg-outline-variant/30" />
                <div className="flex flex-col">
                  <span className="font-label text-primary text-2xl font-bold">
                    10M+
                  </span>
                  <span className="font-label text-xs uppercase tracking-widest opacity-60">
                    Inference/Day
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
              Designing for <br />
              <span className="text-outline-variant">Certainty.</span>
            </h2>
            <p className="text-on-surface-variant font-light text-lg mb-8">
              We build in an era of stochastic outputs. My role is to wrap that
              uncertainty in a shell of engineering excellence.
            </p>
            <div className="flex items-center gap-4 text-secondary">
              <span className="material-symbols-outlined">architecture</span>
              <span className="font-label tracking-widest uppercase text-sm">
                System Integrity First
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
                Core Languages
              </h4>
              <p className="text-on-surface-variant text-sm font-light">
                The foundational logic of intelligence.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {['Python', 'C++', 'Rust', 'Go'].map((tag) => (
                <span
                  key={tag}
                  className="bg-surface-container-highest px-3 py-1 rounded-md text-xs font-label text-on-surface"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Deep Learning */}
          <motion.div
            className="md:col-span-2 lg:col-span-3 glass-card p-8 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors"
            variants={fadeUp}
          >
            <div>
              <span className="material-symbols-outlined text-secondary mb-4 text-3xl">
                neurology
              </span>
              <h4 className="font-headline font-bold text-xl mb-2">
                Deep Learning
              </h4>
              <p className="text-on-surface-variant text-sm font-light">
                Modeling complex patterns and non-linear relationships.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {['PyTorch', 'TensorFlow', 'JAX', 'Transformers', 'OpenAI SDK'].map(
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
                AWS / GCP / Azure
              </p>
            </div>
          </motion.div>

          {/* Orchestration */}
          <motion.div
            className="md:col-span-2 lg:col-span-4 glass-card p-8 rounded-xl relative overflow-hidden group hover:bg-surface-container-high transition-colors"
            variants={fadeUp}
          >
            <div className="relative z-10">
              <h4 className="font-headline font-bold text-xl mb-4">
                Orchestration &amp; Scale
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Kubernetes', color: 'bg-secondary' },
                  { name: 'Docker', color: 'bg-primary' },
                  { name: 'Terraform', color: 'bg-outline' },
                  { name: 'ArgoCD', color: 'bg-secondary' },
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

          {/* Data Systems */}
          <motion.div
            className="md:col-span-2 lg:col-span-2 glass-card p-8 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors"
            variants={fadeUp}
          >
            <h4 className="font-headline font-bold text-xl mb-4">
              Data Systems
            </h4>
            <ul className="space-y-2 font-label text-sm text-on-surface-variant">
              <li>&#8226; PostgreSQL / NoSQL</li>
              <li>&#8226; Pinecone Vector DB</li>
              <li>&#8226; Apache Kafka</li>
              <li>&#8226; Spark / Snowflake</li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* Career Timeline */}
      <section className="max-w-7xl mx-auto px-8 mb-40">
        <motion.h2
          className="font-headline text-5xl font-black text-on-surface mb-20 uppercase tracking-tighter text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Career <span className="text-primary">Timeline.</span>
        </motion.h2>
        <div className="relative border-l-2 border-outline-variant/20 ml-4 md:ml-0 md:left-1/2 md:-translate-x-px space-y-24">
          {/* Experience 1: Lead AI Architect */}
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
                  2022 — Present
                </span>
                <h3 className="font-headline text-2xl font-black text-on-surface">
                  Lead AI Architect
                </h3>
                <p className="text-secondary font-label text-sm uppercase tracking-wider mb-4">
                  Synthetix Labs
                </p>
              </div>
              <div className="md:w-5/12 ml-10 md:ml-0 md:pl-12 mt-4 md:mt-0">
                <div className="glass-card p-6 rounded-xl">
                  <p className="text-on-surface-variant font-light mb-4">
                    Spearheading the development of autonomous agentic
                    frameworks. Scaled inference infrastructure to support 50k+
                    concurrent users with &lt;150ms latency.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {['LLMOps', 'Kubernetes', 'RAG'].map((tag) => (
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

          {/* Experience 2: ML Engineer */}
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
                  2020 — 2022
                </span>
                <h3 className="font-headline text-2xl font-black text-on-surface">
                  ML Engineer
                </h3>
                <p className="text-primary font-label text-sm uppercase tracking-wider mb-4">
                  Cyberdyne Systems
                </p>
              </div>
              <div className="md:w-5/12 ml-10 md:ml-0 md:pr-12 mt-4 md:mt-0">
                <div className="glass-card p-6 rounded-xl">
                  <p className="text-on-surface-variant font-light mb-4">
                    Optimized computer vision models for edge devices. Reduced
                    model size by 40% through quantization while maintaining
                    98.2% accuracy on benchmark datasets.
                  </p>
                  <div className="flex gap-2 flex-wrap md:justify-end">
                    {['PyTorch', 'C++', 'TensorRT'].map((tag) => (
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

          {/* Experience 3: Software Engineer */}
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
                  2018 — 2020
                </span>
                <h3 className="font-headline text-2xl font-black text-on-surface">
                  Software Engineer
                </h3>
                <p className="text-secondary font-label text-sm uppercase tracking-wider mb-4">
                  Vector Stream
                </p>
              </div>
              <div className="md:w-5/12 ml-10 md:ml-0 md:pl-12 mt-4 md:mt-0">
                <div className="glass-card p-6 rounded-xl">
                  <p className="text-on-surface-variant font-light mb-4">
                    Backend engineering focused on high-throughput data
                    pipelines. Built a custom distributed logging system handling
                    1TB+ of telemetry data daily.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {['Golang', 'Kafka', 'gRPC'].map((tag) => (
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

      {/* Recognition & Publications */}
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
              Contributions to the academic and open-source community.
            </p>
          </div>
          <button className="font-label text-xs tracking-widest uppercase text-primary hover:text-secondary transition-colors flex items-center gap-2">
            View Google Scholar{' '}
            <span className="material-symbols-outlined text-sm">
              open_in_new
            </span>
          </button>
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
              NeurIPS 2023 — Research Paper
            </span>
            <h4 className="font-headline font-bold text-xl mb-3 text-on-surface">
              &ldquo;Efficiency in Transformer Scaling: A Minimalist Approach to
              Latency&rdquo;
            </h4>
            <p className="text-on-surface-variant text-sm font-light mb-4">
              A study on reducing memory footprint for large-scale transformer
              architectures without compromising semantic depth.
            </p>
            <a
              className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest"
              href="#"
            >
              Read Publication
            </a>
          </motion.div>

          <motion.div
            className="glass-card p-8 rounded-xl border-l-4 border-l-secondary hover:translate-x-2 transition-transform"
            variants={fadeUp}
          >
            <span className="font-label text-xs text-outline mb-2 block">
              Open Source — Project Founder
            </span>
            <h4 className="font-headline font-bold text-xl mb-3 text-on-surface">
              &ldquo;Nebula-Queue: Distributed Priority Tasks for ML&rdquo;
            </h4>
            <p className="text-on-surface-variant text-sm font-light mb-4">
              Featured in &apos;Top 10 Tools for MLOps 2023&apos;. Nebula-Queue
              optimizes GPU task scheduling for heterogeneous clusters.
            </p>
            <a
              className="inline-flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest"
              href="#"
            >
              GitHub Repository
            </a>
          </motion.div>

          <motion.div
            className="glass-card p-8 rounded-xl border-l-4 border-l-outline hover:translate-x-2 transition-transform"
            variants={fadeUp}
          >
            <span className="font-label text-xs text-outline mb-2 block">
              MIT Tech Review — Featured Interview
            </span>
            <h4 className="font-headline font-bold text-xl mb-3 text-on-surface">
              &ldquo;The Architect&apos;s Role in the AI Renaissance&rdquo;
            </h4>
            <p className="text-on-surface-variant text-sm font-light mb-4">
              Discussing the necessity of engineering-first mentalities in the
              rapid deployment of generative AI models.
            </p>
            <a
              className="inline-flex items-center gap-2 text-outline text-xs font-bold uppercase tracking-widest"
              href="#"
            >
              Watch Interview
            </a>
          </motion.div>

          <motion.div
            className="glass-card p-8 rounded-xl border-l-4 border-l-primary hover:translate-x-2 transition-transform"
            variants={fadeUp}
          >
            <span className="font-label text-xs text-outline mb-2 block">
              Patents — 2021
            </span>
            <h4 className="font-headline font-bold text-xl mb-3 text-on-surface">
              US Pat. 11,402,931: Dynamic Resource Allocation
            </h4>
            <p className="text-on-surface-variant text-sm font-light mb-4">
              Method for real-time allocation of computational resources in
              decentralized neural network training environments.
            </p>
            <a
              className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest"
              href="#"
            >
              View Patent
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
              Ready to architect the{' '}
              <span className="text-secondary italic">future</span>?
            </h2>
            <Link
              to="/contact"
              className="inline-block bg-primary text-on-primary font-headline font-extrabold text-lg px-12 py-5 rounded-full hover:scale-110 transition-transform active:scale-95 shadow-xl"
            >
              Schedule a Consultation
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
    </>
  )
}
