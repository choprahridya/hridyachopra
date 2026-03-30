'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { DividerMotif, RevealText } from '@/components/ui';

const featuredProjects = [
  { id: '1', title: 'E-commerce UX Overhaul', category: 'Brand Identity', year: '2024', bg: '#EAE5DD' },
  { id: '2', title: 'Mobile App Redesign', category: 'UX / UI', year: '2024', bg: '#DDE5EA' },
  { id: '3', title: 'Enterprise Design System', category: 'Systems', year: '2023', bg: '#E5EADD' },
  { id: '4', title: 'Visual Identity System', category: 'Brand', year: '2024', bg: '#EAE0DD' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0, 0, 1] as const },
  }),
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg">

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-[--page-padding] pt-24 pb-16 min-h-screen">
        {/* Wordmark + asterisks */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative mb-8"
        >
          <span className="absolute -top-3 -left-6 text-text-muted font-sans text-lg select-none">*</span>
          <span className="absolute -top-3 -right-6 text-text-muted font-sans text-lg select-none">*</span>
          <span className="absolute -bottom-3 -left-6 text-text-muted font-sans text-lg select-none">*</span>
          <span className="absolute -bottom-3 -right-6 text-text-muted font-sans text-lg select-none">*</span>

          <div className="flex items-start gap-3">
            <h1
              className="font-script text-text-primary leading-none"
              style={{ fontSize: 'var(--text-wordmark)' }}
            >
              Portfolio
            </h1>
            <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-pill border border-border-dark text-[11px] font-sans font-medium text-text-muted tracking-[0.06em]">
              2025
            </span>
          </div>
        </motion.div>

        {/* Role */}
        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[15px] text-text-secondary font-sans mb-10 tracking-[0.04em]"
        >
          UI/UX &amp; Brand Designer · Available for work
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex gap-4 flex-wrap justify-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-7 py-3 border border-text-primary rounded-pill text-[13px] font-medium text-text-primary tracking-[0.04em] transition-colors hover:bg-text-primary hover:text-bg"
          >
            View Projects →
          </Link>
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors border-b border-transparent hover:border-text-secondary pb-px"
          >
            Download CV →
          </a>
        </motion.div>
      </section>

      <DividerMotif />

      {/* ── Featured Work ── */}
      <section className="px-[--page-padding] pb-24">
        <div className="max-w-site mx-auto">
          <RevealText className="flex items-baseline justify-between mb-10">
            <h2 className="font-serif text-[var(--text-h2)] text-text-primary">Featured Work</h2>
            <Link
              href="/projects"
              className="text-[13px] text-text-secondary hover:text-text-primary transition-colors border-b border-transparent hover:border-text-secondary pb-px"
            >
              All projects →
            </Link>
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project, index) => (
              <RevealText key={project.id} delay={index * 0.08}>
                <Link href={`/projects/${project.id}`} className="group block">
                  <div
                    className="w-full rounded-md overflow-hidden border border-border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                  >
                    <div
                      className="w-full flex items-center justify-center font-serif text-text-muted text-sm overflow-hidden transition-transform duration-500 group-hover:scale-[1.04]"
                      style={{ aspectRatio: '3/2', background: project.bg }}
                    >
                      {project.title}
                    </div>
                    <div className="p-5 bg-bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="pill">{project.category}</span>
                        <span className="text-[12px] text-text-muted">{project.year}</span>
                      </div>
                      <p className="font-serif text-[var(--text-h3)] text-text-primary">{project.title}</p>
                    </div>
                  </div>
                </Link>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      <DividerMotif />

      {/* ── Mini About ── */}
      <section className="px-[--page-padding] pb-24">
        <div
          className="max-w-site mx-auto grid md:grid-cols-[1fr_2fr] gap-16 items-center px-16 py-16 rounded-xl"
          style={{ background: 'var(--color-bg-overlay)' }}
        >
          <RevealText>
            <div
              className="w-40 h-40 rounded-full mx-auto flex items-center justify-center text-text-muted text-sm font-sans"
              style={{ background: 'var(--color-border)' }}
            >
              Photo
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="font-serif text-[var(--text-h2)] text-text-primary mb-3">Hridya Chopra</h2>
            <p className="text-[15px] text-text-secondary leading-[var(--lh-loose)] mb-6 max-w-prose">
              UI/UX &amp; brand designer crafting considered digital experiences through strategic
              thinking and visual refinement. Available for freelance and full-time roles.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3 border border-text-primary rounded-pill text-[13px] font-medium text-text-primary tracking-[0.04em] transition-colors hover:bg-text-primary hover:text-bg"
              >
                About me →
              </Link>
              <a
                href="mailto:hello@hridyachopra.com"
                className="inline-flex items-center gap-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors border-b border-transparent hover:border-text-secondary pb-px"
              >
                hello@hridyachopra.com →
              </a>
            </div>
          </RevealText>
        </div>
      </section>

      <DividerMotif />

      <Footer />
    </main>
  );
}
