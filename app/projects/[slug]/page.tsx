import Link from 'next/link';
import { Footer } from '@/components/Footer';

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen flex flex-col bg-bg pt-16">
      <section className="flex-1 flex flex-col items-center justify-center px-[--page-padding] text-center">
        <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-4">
          Case Study
        </p>
        <h1
          className="font-serif text-text-primary mb-6"
          style={{ fontSize: 'var(--text-h1)', lineHeight: 'var(--lh-tight)' }}
        >
          Coming soon
        </h1>
        <p className="text-[15px] text-text-secondary mb-10">
          This case study is being written. Check back soon.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors border-b border-transparent hover:border-text-secondary pb-px"
        >
          ← Back to Projects
        </Link>
      </section>
      <Footer />
    </main>
  );
}
