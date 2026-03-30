'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Disc, type Project } from '@/components/Disc';
import { Footer } from '@/components/Footer';
import { DividerMotif, RevealText, PillTag } from '@/components/ui';

const projects: Project[] = [
  { id: '1', title: 'E-commerce UX', thumbnail: '', color: '#E8E4DC' },
  { id: '2', title: 'App Redesign', thumbnail: '', color: '#E4E8DC' },
  { id: '3', title: 'Design System', thumbnail: '', color: '#DCE4E8' },
  { id: '4', title: 'Visual Identity', thumbnail: '', color: '#E8DCDC' },
  { id: '5', title: 'Marketing Site', thumbnail: '', color: '#E8E8DC' },
  { id: '6', title: 'Product Strategy', thumbnail: '', color: '#DCE8E4' },
];

const projectDetails = [
  { id: '1', title: 'E-commerce UX Overhaul', category: 'Brand Identity', year: '2024', bg: '#EAE5DD' },
  { id: '2', title: 'Mobile App Redesign', category: 'UX / UI', year: '2024', bg: '#DDE5EA' },
  { id: '3', title: 'Enterprise Design System', category: 'Systems', year: '2023', bg: '#E5EADD' },
  { id: '4', title: 'Visual Identity System', category: 'Brand', year: '2024', bg: '#EAE0DD' },
  { id: '5', title: 'Marketing Site', category: 'Web', year: '2023', bg: '#EAEADD' },
  { id: '6', title: 'Product Strategy', category: 'Strategy', year: '2024', bg: '#DDECE6' },
];

export default function ProjectsPage() {
  const [activeProject, setActiveProject] = useState(projects[0]);

  return (
    <main className="min-h-screen flex flex-col bg-bg pt-16">

      {/* ── Disc interaction ── */}
      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Left — Disc */}
        <div className="lg:w-1/2 flex items-center justify-center px-8 py-20 lg:py-0">
          <div className="scale-90 md:scale-100">
            <Disc projects={projects} onActiveProjectChange={setActiveProject} />
          </div>
        </div>

        {/* Right — Active project info */}
        <div className="lg:w-1/2 flex items-center px-8 lg:px-16 py-16 lg:py-0">
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0, 0, 1] }}
            className="max-w-xl"
          >
            <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-6">
              Selected Work
            </p>

            <h1
              className="font-serif text-text-primary mb-6"
              style={{ fontSize: 'var(--text-h1)', lineHeight: 'var(--lh-tight)' }}
            >
              {activeProject.title}
            </h1>

            <p className="text-[15px] text-text-secondary leading-[var(--lh-loose)] mb-8">
              A considered project that redefines the digital experience and sets a new standard
              for design excellence.
            </p>

            <div className="flex gap-2 mb-10 flex-wrap">
              <PillTag>Brand</PillTag>
              <PillTag>Identity</PillTag>
              <PillTag>2024</PillTag>
            </div>

            <Link
              href={`/projects/${activeProject.id}`}
              className="inline-flex items-center gap-2 px-7 py-3 border border-text-primary rounded-pill text-[13px] font-medium text-text-primary tracking-[0.04em] transition-colors hover:bg-text-primary hover:text-bg"
            >
              View Case Study →
            </Link>
          </motion.div>
        </div>
      </section>

      <DividerMotif />

      {/* ── Full project grid ── */}
      <section className="px-[--page-padding] pb-24">
        <div className="max-w-site mx-auto">
          <RevealText className="mb-12">
            <h2 className="font-serif text-[var(--text-h2)] text-text-primary">All Projects</h2>
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectDetails.map((project, index) => (
              <RevealText key={project.id} delay={index * 0.07}>
                <Link href={`/projects/${project.id}`} className="group block">
                  <div className="rounded-md overflow-hidden border border-border bg-bg-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                    <div
                      className="w-full flex items-center justify-center font-serif text-text-muted text-sm transition-transform duration-500 group-hover:scale-[1.04]"
                      style={{ aspectRatio: '3/2', background: project.bg }}
                    >
                      {project.title}
                    </div>
                    <div className="p-5">
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

      <Footer />
    </main>
  );
}
