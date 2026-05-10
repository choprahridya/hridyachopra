'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Disc, type Project } from '@/components/Disc';
import { Footer } from '@/components/Footer';
import { PillTag } from '@/components/ui';

const projects: Project[] = [
  { id: '1', title: 'Xchange', thumbnail: '/projects/1/thumb.png', color: '#E8E4DC' },
  { id: '2', title: "Franklins", thumbnail: '/projects/2/thumb.png', color: '#E4E8DC' },
  { id: '3', title: 'Cogniva', thumbnail: '/projects/3/cover.png', color: '#DCE4E8' },
  { id: '4', title: 'Coming Soon', thumbnail: '', color: '#E8DCDC' },
  { id: '5', title: 'Coming Soon', thumbnail: '', color: '#E4E8E4' },
];

const COMING_SOON_IDS = new Set(['4', '5']);

const projectDetails = [
  { id: '1', title: 'Xchange', bg: '#EAE5DD', thumbnail: '/projects/1/1.png', blurb: 'A community-driven app designed to make local exchanges feel simple, fast, and trustworthy.', tags: ['Product', 'UI/UX', '2022'] },
  { id: '2', title: "Franklins", bg: '#DDE5EA', thumbnail: '/projects/2/cover.png', blurb: 'A digital experience designed to reflect the calm, inviting atmosphere of a neighborhood coffee shop.', tags: ['Website Redesign', 'UI/UX', '2026'] },
  { id: '3', title: 'Cogniva', bg: '#DCE4E8', blurb: 'A socially assistive robot designed to foster meaningful connection in nursing homes.', tags: ['Product', 'UI/UX', '2026'] },
  { id: '4', title: 'Coming Soon', bg: '#E8DCDC', blurb: '', tags: [] },
  { id: '5', title: 'Coming Soon', bg: '#E4E8E4', blurb: '', tags: [] },
];

export default function ProjectsPage() {
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [showGrid, setShowGrid] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const isComingSoon = COMING_SOON_IDS.has(activeProject.id);
  const activeDetail = projectDetails.find(p => p.id === activeProject.id);

  const handleShowGrid = () => {
    setShowGrid(true);
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bg pt-16">

      {/* ── Disc interaction ── */}
      <section className="relative min-h-screen flex items-center" style={{ overflowX: 'clip' }}>
        {/* Left — Giant half-moon disc anchored to left edge, half visible */}
        <div
          className="absolute top-1/2 hidden lg:block"
          style={{ left: '-450px', transform: 'translateY(-50%)' }}
        >
          <Disc projects={projects} onActiveProjectChange={setActiveProject} size={900} />
        </div>

        {/* Right — Active project info */}
        <div className="relative z-10 ml-auto w-full lg:w-[52%] px-16 py-32">
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0, 0, 1] }}
            className="max-w-md"
          >
            <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-6">
              Selected Work
            </p>

            <h1
              className="font-serif text-text-primary mb-6"
              style={{ fontSize: 'var(--text-h1)', lineHeight: 'var(--lh-tight)' }}
            >
              {activeProject.title === 'Coming Soon' ? 'Coming Soon' : activeProject.title}
            </h1>

            <p className="text-[15px] text-text-secondary leading-[var(--lh-loose)] mb-8">
              {isComingSoon
                ? 'This project is currently in progress. Check back soon.'
                : activeDetail?.blurb || ''}
            </p>

            {!isComingSoon && activeDetail && activeDetail.tags.length > 0 && (
              <div className="flex gap-4 mb-10 flex-wrap">
                {activeDetail.tags.map(tag => <PillTag key={tag}>{tag}</PillTag>)}
              </div>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              {!isComingSoon && (
                <Link
                  href={`/projects/${activeProject.id}`}
                  className="inline-flex items-center gap-2 px-7 py-3 border border-text-primary rounded-pill text-[13px] font-medium text-text-primary tracking-[0.04em] transition-colors hover:bg-text-primary hover:text-bg"
                >
                  View Case Study →
                </Link>
              )}

              <button
                onClick={handleShowGrid}
                className="inline-flex items-center gap-2 px-7 py-3 text-[13px] font-medium text-text-secondary tracking-[0.04em] transition-colors hover:text-text-primary"
              >
                All Projects ↓
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── All projects grid ── */}
      <AnimatePresence>
        {showGrid && (
          <motion.section
            ref={gridRef}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
            className="px-[--page-padding] py-24"
          >
            <div className="max-w-site mx-auto">
              <div className="flex items-baseline justify-between mb-12">
                <h2 className="font-serif text-text-primary" style={{ fontSize: 'var(--text-h2)' }}>
                  All Projects
                </h2>
                <button
                  onClick={() => setShowGrid(false)}
                  className="text-[13px] text-text-muted hover:text-text-primary transition-colors tracking-[0.04em]"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectDetails.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0, 0, 1] }}
                  >
                    {COMING_SOON_IDS.has(project.id) ? (
                      <div className="rounded-md overflow-hidden border border-border bg-bg-card opacity-60">
                        <div
                          className="w-full overflow-hidden"
                          style={{ aspectRatio: '3/2', background: `var(--disc-color-${index + 1})` }}
                        >
                          <div className="w-full h-full flex items-center justify-center font-serif text-text-muted text-sm italic">
                            Coming Soon
                          </div>
                        </div>
                        <div className="p-5">
                          <p className="font-serif text-[var(--text-h3)] text-text-muted">Coming Soon</p>
                        </div>
                      </div>
                    ) : (
                      <Link href={`/projects/${project.id}`} className="group block">
                        <div className="rounded-md overflow-hidden border border-border bg-bg-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                          <div
                            className="w-full overflow-hidden"
                            style={{ aspectRatio: '3/2', background: `var(--disc-color-${index + 1})` }}
                          >
                            {(project as typeof project & { thumbnail?: string }).thumbnail ? (
                              <img
                                src={(project as typeof project & { thumbnail?: string }).thumbnail}
                                alt={project.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-serif text-text-muted text-sm">
                                {project.title}
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <p className="font-serif text-[var(--text-h3)] text-text-primary">{project.title}</p>
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
