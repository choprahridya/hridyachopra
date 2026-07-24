import Link from 'next/link';
import { Footer } from '@/components/Footer';

interface Section {
  type: 'image' | 'image-pair' | 'text';
  src?: string;
  srcs?: [string, string];
  label?: string;
  heading?: string;
  body?: string;
  callout?: string;
  small?: boolean;
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
    description: 'Xchange is a community-driven book exchange platform that makes reading more affordable and sustainable. By enabling people to exchange books instead of buying new ones, it reduces costs, minimizes waste, and extends the life of every book.',
    sections: [
      { type: 'image', src: '/projects/1/xchange-books.png' },
      {
        type: 'text',
        label: 'Problem',
        heading: 'A constant demand families struggle to meet',
        body: 'Children quickly outgrow books, creating a constant demand that many families struggle to afford. As books sit unused on shelves or are discarded, thousands of reusable books go to waste while others still lack access to reading materials. This cycle is also environmentally unsustainable, with roughly one tree used to produce every 62.5 books.',
      },
      { type: 'image', src: '/projects/1/xhca-1.png' },
      {
        type: 'text',
        label: 'Solution',
        heading: 'A community-first exchange platform',
        body: 'Xchange connects nearby readers, allowing them to exchange books instead of purchasing new ones. Users list books they\'ve finished, discover titles available within their community, and arrange swaps, keeping books in circulation instead of letting them collect dust.',
      },
      {
        type: 'text',
        label: 'My Role',
        heading: 'Co-Founder, leading design end to end',
        body: 'I co-founded Xchange and led the end-to-end visual design and user experience, from early concept through the mobile app prototype in Figma.',
      },
      {
        type: 'text',
        label: 'Result',
        heading: 'Real impact, measurable growth',
        body: 'Since launching in May 2022, Xchange has facilitated the exchange of over 25,000 books through community drives and its growing network. The initiative has donated 2,000+ books, helped families save nearly $25,000, preserved approximately 400 trees, and secured funding to support app development. It has also been recognized by Youth Ki Awaaz, Plaksha University, and Youth Ideathon 2023.',
      },
      { type: 'image-pair', srcs: ['/projects/1/frame-3.png', '/projects/1/frame-4.png'] },
      {
        type: 'text',
        label: 'Conclusion',
        heading: 'Recognition and what comes next',
        body: 'Xchange continues to evolve as both a social initiative and a digital product. The next phase focuses on expanding the community, improving the exchange experience, and working toward our goal of exchanging one million books by 2028.',
        callout: 'Our goal is to Xchange a Million Books by 2028.',
      },
    ],
  },
  '2': {
    title: "Website Redesign: Franklin's",
    category: 'UX / UI',
    year: '2026',
    description: "A full UX and visual redesign of Franklin's restaurant website, improving navigation, menu hierarchy, and the mobile experience while preserving the restaurant's warm, welcoming identity.",
    sections: [
      { type: 'image', src: '/projects/2/cover-new.png' },
      {
        type: 'text',
        label: 'Problem',
        heading: 'A website that didn\'t reflect the experience',
        body: 'Franklin\'s is a beloved local restaurant with a warm, welcoming atmosphere, but its website felt cluttered and difficult to navigate. Customers struggled to find the menu, make reservations, and learn about the restaurant, while the mobile experience lacked usability and visual consistency.',
      },
      { type: 'image-pair', srcs: ['/projects/2/franklins-1.png', '/projects/2/journey-map.png'] },
      {
        type: 'text',
        label: 'Solution',
        heading: 'Clarity and warmth in every interaction',
        body: "The redesign simplified the experience into three primary actions: view the menu, make a reservation, and explore the restaurant's story. A warmer visual language, improved typography, and a mobile-first layout created a more intuitive experience, while a streamlined reservation flow reduced friction.",
      },
      {
        type: 'text',
        label: 'My Role',
        heading: 'UX Designer',
        body: 'Led the redesign of the menu page, improving navigation, content hierarchy, and mobile usability, while collaborating on the design and refinement of the remaining website pages to create a cohesive user experience.',
      },
      { type: 'image-pair', srcs: ['/projects/2/menu.png', '/projects/2/menu-mobile.png'] },
      {
        type: 'text',
        label: 'Result',
        heading: 'A simpler, more intuitive user experience',
        body: 'The redesigned experience makes it easier for users to browse the menu, book a table, and explore the restaurant with fewer steps and clearer navigation. The mobile-first approach improves accessibility and creates a more seamless experience across devices.',
      },
      {
        type: 'text',
        label: 'Conclusion',
        heading: 'Building on the experience',
        body: "This redesign demonstrates how thoughtful UX and visual design can transform a restaurant's digital presence. Future iterations could introduce online ordering, loyalty features, and accessibility improvements while maintaining Franklin's warm and welcoming identity.",
      },
    ],
  },
  '3': {
    title: 'Cogniva',
    category: 'Product',
    year: '2026',
    description: 'Cogniva is a socially assistive companion system designed to reduce emotional isolation among nursing home residents through meaningful peer interaction, shared experiences, and daily engagement.',
    sections: [
      { type: 'image', src: '/projects/3/cover.png' },
      {
        type: 'text',
        label: 'Problem',
        heading: 'Isolation is a silent crisis in care homes',
        body: 'Limited social interaction contributes to emotional isolation, negatively affecting residents\' mental and emotional well-being. At the same time, nursing homes continue to face staffing shortages, making it difficult to provide consistent social engagement at scale.',
        callout: '1 in 4 older adults experience social isolation. 1 in 3 report feelings of loneliness. 3 in 4 nursing homes report staffing shortages.',
      },
      {
        type: 'text',
        label: 'Solution',
        heading: 'A companion system built for connection',
        body: 'Cogniva is a socially assistive companion system designed to foster meaningful connections in nursing homes through three core experiences. Life Link enables residents to preserve and share personal stories, strengthening connections across generations and with fellow residents. Bridge Mode encourages one-on-one conversations and guided social activities between residents. Circle Connect brings together small groups with shared interests, creating opportunities for regular social interaction without replacing human care.',
      },
      {
        type: 'text',
        label: 'My Role',
        heading: 'UX Designer (Team of 4)',
        body: "Conducted user research, contributed to concept development, designed user flows and interfaces, created high-fidelity prototypes in Figma, and collaborated with teammates to define Cogniva's core interaction experiences for the SCAD StartUp Competition.",
      },
      { type: 'image-pair', srcs: ['/projects/3/robot-1.png', '/projects/3/robot-2.png'], small: true },
      {
        type: 'text',
        label: 'Result',
        heading: 'Recognized for its potential',
        body: "Cogniva was awarded 3rd place at the SCAD StartUp Competition, where our four-member team received a $2,000 scholarship in recognition of the concept's innovation and potential to address emotional isolation in elder care.",
      },
      {
        type: 'text',
        label: 'Conclusion',
        heading: 'From concept to future impact',
        body: 'While Cogniva is currently a concept, the recognition from the SCAD StartUp Competition validated both the problem and the proposed solution. Future work includes developing a functional prototype, refining the physical interaction experience, and testing Life Link, Bridge Mode, and Circle Connect with nursing home residents to evaluate usability and real-world impact.',
      },
    ],
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
      {section.callout && (
        <p className="text-[15px] text-text-primary font-semibold leading-[var(--lh-loose)] mt-3">
          {section.callout}
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
          <p className="text-[length:var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-4">
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
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted font-sans mb-3">
                Overview
              </p>
              <p className="text-[15px] text-text-secondary leading-[var(--lh-loose)]">
                {project.description}
              </p>
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-4">
          {project.sections.map((section, i) =>
            section.type === 'text' ? (
              <TextSection key={i} section={section} />
            ) : section.type === 'image-pair' ? (
              <div key={i} className={section.small ? 'flex gap-4 mx-auto' : 'grid grid-cols-2 gap-4'} style={section.small ? { maxWidth: '520px' } : undefined}>
                {section.srcs?.map((src, j) => (
                  <div key={j} className="rounded-xl overflow-hidden flex-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${project.title} image ${i + 1}.${j + 1}`} className="w-full h-auto block" loading="lazy" />
                  </div>
                ))}
              </div>
            ) : (
              <div key={i} className="w-full rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={section.src}
                  alt={`${project.title} image ${i + 1}`}
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
