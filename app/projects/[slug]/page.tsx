import Link from 'next/link';
import { Footer } from '@/components/Footer';

const projects: Record<string, {
  title: string;
  category: string;
  year: string;
  description: string;
  images: string[];
}> = {
  '1': {
    title: 'Xchange',
    category: 'Brand Identity',
    year: '2025',
    description: 'A complete brand identity system built for a modern currency exchange platform — covering logomark, typography, colour palette, and application across digital touchpoints.',
    images: [
      '/projects/1/1.png',
      '/projects/1/2.png',
      '/projects/1/2 - Compressed Version.png',
      '/projects/1/3.png',
      '/projects/1/4.png',
      '/projects/1/5.png',
    ],
  },
  '2': {
    title: "Website Redesign: Franklin's",
    category: 'UX / UI',
    year: '2026',
    description: "A full UX and visual redesign of Franklin's restaurant website — improving navigation, menu hierarchy, and mobile experience while preserving the brand's warm character.",
    images: [
      '/projects/2/cover.png',
      '/projects/2/menu.png',
    ],
  },
};

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    return (
      <main className="min-h-screen flex flex-col bg-bg pt-16">
        <section className="flex-1 flex flex-col items-center justify-center px-[--page-padding] text-center">
          <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-4">
            Case Study
          </p>
          <h1 className="font-serif text-text-primary mb-6" style={{ fontSize: 'var(--text-h1)', lineHeight: 'var(--lh-tight)' }}>
            Coming soon
          </h1>
          <p className="text-[15px] text-text-secondary mb-10">
            This case study is being written. Check back soon.
          </p>
          <Link href="/projects" className="inline-flex items-center gap-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors border-b border-transparent hover:border-text-secondary pb-px">
            ← Back to Projects
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const [hero, ...rest] = project.images;

  return (
    <main className="min-h-screen flex flex-col bg-bg pt-20">
      <section className="px-[--page-padding] pb-24 max-w-site mx-auto w-full">

        {/* Back + header */}
        <div className="mb-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-8 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to Projects
          </Link>

          <div className="flex flex-wrap items-baseline gap-4 mb-3">
            <span className="pill">{project.category}</span>
            <span className="text-[12px] text-text-muted">{project.year}</span>
          </div>

          <h1
            className="font-serif text-text-primary mb-4"
            style={{ fontSize: 'var(--text-h1)', lineHeight: 'var(--lh-tight)' }}
          >
            {project.title}
          </h1>

          <p className="text-[15px] text-text-secondary leading-[var(--lh-loose)] max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* Hero image */}
        <div className="w-full rounded-xl overflow-hidden mb-4 bg-bg-overlay">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero}
            alt={`${project.title} — hero`}
            className="w-full h-auto block"
            loading="eager"
          />
        </div>

        {/* Rest of images — 2-col grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-bg-overlay">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${project.title} — image ${i + 2}`}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

      </section>
      <Footer />
    </main>
  );
}
