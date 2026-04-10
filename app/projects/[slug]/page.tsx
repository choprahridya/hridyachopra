import Link from 'next/link';
import { Footer } from '@/components/Footer';

const projects: Record<string, {
  title: string;
  category: string;
  year: string;
  images: string[];
}> = {
  '1': {
    title: 'Xchange',
    category: 'Brand Identity',
    year: '2025',
    images: [
      '/projects/1/1.png',
      '/projects/1/2.png',
      '/projects/1/3.png',
      '/projects/1/4.png',
      '/projects/1/5.png',
    ],
  },
  '2': {
    title: "Website Redesign: Franklin's",
    category: 'UX / UI',
    year: '2026',
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

  return (
    <main className="min-h-screen flex flex-col bg-bg pt-20">
      <section className="px-[--page-padding] py-12 max-w-site mx-auto w-full">

        {/* Header */}
        <div className="mb-12">
          <Link href="/projects" className="inline-flex items-center gap-2 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-8 block">
            ← Back
          </Link>
          <p className="text-[11px] uppercase tracking-[0.1em] text-text-muted font-sans mb-3">
            {project.category} · {project.year}
          </p>
          <h1 className="font-serif text-text-primary" style={{ fontSize: 'var(--text-h1)', lineHeight: 'var(--lh-tight)' }}>
            {project.title}
          </h1>
        </div>

        {/* Images */}
        <div className="flex flex-col gap-6">
          {project.images.map((src, i) => (
            <div key={i} className="w-full rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${project.title} — image ${i + 1}`}
                className="w-full h-auto block"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

      </section>
      <Footer />
    </main>
  );
}
