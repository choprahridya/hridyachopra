'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { DividerMotif, RevealText } from '@/components/ui';
import { ScatterPuzzle } from '@/components/ScatterPuzzle';

const featuredProjects = [
  { id: '1', title: 'Xchange', category: 'Brand Identity', year: '2025', bg: '#EAE5DD', thumbnail: '/projects/1/1.png', hoverImage: '/projects/1/2.png' },
  { id: '2', title: "Website Redesign: Franklin's", category: 'UX / UI', year: '2024', bg: '#DDE5EA', thumbnail: '/projects/2/cover.png', hoverImage: '/projects/2/menu.png' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0, 0, 1] as const },
  }),
};

function ProjectCard({ project, index }: { project: typeof featuredProjects[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <RevealText delay={index * 0.08}>
      <Link
        href={`/projects/${project.id}`}
        className="group block relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Card */}
        <div className="w-full rounded-md overflow-hidden border border-border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <div className="relative w-full overflow-hidden" style={{ height: '400px' }}>
            {/* Original image */}
            <img
              src={project.thumbnail}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              style={{ opacity: hovered ? 0 : 1 }}
              loading="lazy"
            />
            {/* Hover image — overlaid, same dimensions */}
            {project.hoverImage && (
              <img
                src={project.hoverImage}
                alt={`${project.title} preview`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: hovered ? 1 : 0 }}
                loading="lazy"
              />
            )}
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
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg">

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-[--page-padding] pt-24 pb-16 min-h-screen">

        {/* Scatter puzzle — button at bottom, pieces fly upward */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="w-full max-w-2xl mx-auto"
        >
          <ScatterPuzzle />
        </motion.div>

        {/* Intro text */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8"
        >
          <h1
            className="font-serif text-text-primary mb-4"
            style={{ fontSize: '48px', lineHeight: 1.1 }}
          >
            Hi, I am Hridya Chopra
          </h1>
          <p className="font-sans leading-relaxed max-w-lg mx-auto" style={{ fontSize: '24px', color: 'var(--color-text-secondary)' }}>
            A UX designer, studying at SCAD who loves to solve problems using design.
          </p>
        </motion.div>

        {/* Scroll down arrow */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-[11px] uppercase tracking-[0.12em] text-text-muted font-sans">Scroll</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3 L10 17 M4 11 L10 17 L16 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted" />
            </svg>
          </motion.div>
        </motion.div>

      </section>

      <DividerMotif />

      {/* ── Featured Work ── */}
      <section className="px-[--page-padding] pb-24">
        <div className="max-w-site mx-auto">
          <RevealText className="mb-10">
            <h2 className="font-serif text-[var(--text-h2)] text-text-primary">Featured Work</h2>
          </RevealText>

          <div className="flex flex-wrap gap-5 mb-10">
            {featuredProjects.map((project, index) => (
              <div key={project.id} style={{ width: '650px' }}>
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>

          <RevealText delay={0.2}>
            <div className="flex justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-3 border border-text-primary rounded-pill text-[13px] font-medium text-text-primary tracking-[0.04em] transition-colors hover:bg-text-primary hover:text-bg"
              >
                View All Projects →
              </Link>
            </div>
          </RevealText>
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
            <div className="w-40 h-40 rounded-full mx-auto overflow-hidden">
              <img src="/about-hridya.jpg" alt="Hridya Chopra" className="w-full h-full object-cover" style={{ objectPosition: '50% 15%' }} />
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="font-serif text-[var(--text-h2)] text-text-primary mb-3">Hridya Chopra</h2>
            <p className="text-[15px] text-text-secondary leading-[var(--lh-loose)] mb-6 max-w-prose">
              BFA UX Design student at SCAD, on the Dean's List with a 3.6 GPA. I work across
              UX design, digital marketing, and visual identity — with a background in Figma,
              Illustrator, and Photoshop. Always looking for work where design actually matters.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3 border border-text-primary rounded-pill text-[13px] font-medium text-text-primary tracking-[0.04em] transition-colors hover:bg-text-primary hover:text-bg"
              >
                About me →
              </Link>
              <a
                href="mailto:choprahridya@gmail.com"
                className="inline-flex items-center gap-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors border-b border-transparent hover:border-text-secondary pb-px"
              >
                choprahridya@gmail.com →
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
