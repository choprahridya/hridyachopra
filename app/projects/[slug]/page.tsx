import Link from 'next/link';
import { Footer } from '@/components/Footer';

interface Section {
  type: 'image' | 'image-pair' | 'text';
  src?: string;
  srcs?: [string, string];
  label?: string;
  heading?: string;
  body?: string;
}

const projects: Record<string, {
  title: string;
  category: string;
  year: string;
  description: string;
  sections: Section[];
}> = {
  '1': {
    title: 'Xchange',
    category: 'Product',
    year: '2022',
    description: 'Xchange is a book exchange platform that makes reading more affordable and sustainable. By allowing users to swap already read books within a community, it reduces costs, minimizes waste, and extends the life of each book offering an eco-friendly alternative to buying new ones.',
    sections: [
      { type: 'image', src: '/projects/1/xchange-books.png' },
      {
        type: 'text',
        label: 'Problem',
        heading: 'A constant demand families struggle to meet',
        body: 'There is a constant demand for new books, which many families struggle to keep up with. As books are quickly outgrown, they often go unused or create waste, while many children still lack access to basic reading materials. This cycle is also environmentally unsustainable, with about one tree cut for every 62.5 books produced.',
      },
      { type: 'image', src: '/projects/1/xhca-1.png' },
      {
        type: 'text',
        label: 'Results',
        heading: 'Real impact, measurable growth',
        body: 'Since May 2022, Xchange has facilitated the exchange of 25,000+ books through drives and an active community. It has donated 2,000+ books, helped families save nearly $43K, and preserved around 400 trees. The initiative also raised funds for its app and gained support from platforms like YouthKiAwaaz, Plaksha University, and YouthIdeathon 2023.',
      },
      { type: 'image-pair', srcs: ['/projects/1/frame-4.png', '/projects/1/frame-3.png'] },
      {
        type: 'text',
        label: 'Conclusion',
        heading: 'Recognition and what comes next',
        body: 'Xchange has been recognized by IIT Kanpur, Plaksha University, Youth Ideathon, and Youth Ki Awaaz for its impact-driven approach to sustainable book sharing. The project continues to evolve, with ongoing efforts focused on expanding its reach and improving the user experience. Our goal is to Xchange a Million Books by 2028.',
      },
    ],
  },
  '2': {
    title: "Website Redesign: Franklin's",
    category: 'UX / UI',
    year: '2026',
    description: "A full UX and visual redesign of Franklin's restaurant website — improving navigation, menu hierarchy, and mobile experience while preserving the brand's warm character.",
    sections: [
      { type: 'image', src: '/projects/2/cover.png' },
      {
        type: 'text',
        label: 'Problem',
        heading: 'A website that didn\'t reflect the experience',
        body: 'Franklin\'s is a beloved local restaurant with a warm, welcoming atmosphere — but the old website felt cluttered and hard to navigate. Customers struggled to find the menu, make reservations, or understand the brand. Mobile experience was particularly poor.',
      },
      {
        type: 'text',
        label: 'Results',
        heading: 'Clarity and warmth in every interaction',
        body: 'The redesign simplified navigation to three clear paths: menu, reservations, and story. A warmer colour palette and generous typography brought the in-restaurant feeling online. Mobile conversion improved significantly with a single-tap reservation flow.',
      },
      { type: 'image', src: '/projects/2/menu.png' },
      {
        type: 'text',
        label: 'Further Steps',
        heading: 'Online ordering and loyalty',
        body: 'The next phase introduces an online ordering system and a loyalty programme page — keeping the same warm, unhurried design language that makes Franklin\'s feel like a place worth returning to.',
      },
    ],
  },
  '3': {
    title: 'Cogniva',
    category: 'Product',
    year: '2026',
    description: 'A socially assistive robot designed to foster meaningful connection in nursing homes.',
    sections: [],
  },
};

function TextSection({ section }: { section: Section }) {
  return (
    <div className="max-w-2xl py-10">
      {section.label && (
        <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted font-sans mb-3">
          {section.label}
        </p>
      )}
      {section.heading && (
        <h2 className="font-serif text-text-primary mb-4" style={{ fontSize: 'var(--text-h2)', lineHeight: 'var(--lh-tight)' }}>
          {section.heading}
        </h2>
      )}
      {section.body && (
        <p className="text-[15px] text-text-secondary leading-[var(--lh-loose)]">
          {section.body}
        </p>
      )}
    </div>
  );
}

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
      <section className="px-[--page-padding] pb-24 max-w-site mx-auto w-full">

        {/* Header */}
        <div className="mb-12">
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

          {project.description && (
            <p className="text-[15px] text-text-secondary leading-[var(--lh-loose)]">
              {project.description}
            </p>
          )}
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-4">
          {project.sections.map((section, i) =>
            section.type === 'text' ? (
              <TextSection key={i} section={section} />
            ) : section.type === 'image-pair' ? (
              <div key={i} className="grid grid-cols-2 gap-4">
                {section.srcs?.map((src, j) => (
                  <div key={j} className="w-full rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${project.title} — image ${i + 1}.${j + 1}`} className="w-full h-auto block" loading="lazy" />
                  </div>
                ))}
              </div>
            ) : (
              <div key={i} className="w-full rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={section.src}
                  alt={`${project.title} — image ${i + 1}`}
                  className="w-full h-auto block"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            )
          )}
        </div>

      </section>
      <Footer />
    </main>
  );
}
