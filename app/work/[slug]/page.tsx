'use client';

import { Heading, Eyebrow, BodyText, PillTag, Button, RevealText } from '@/components/ui';
import { notFound } from 'next/navigation';

// Placeholder data - will be replaced with real data later
const caseStudies: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Brand Identity',
    client: 'Acme Studio',
    year: '2024',
    duration: '8 weeks',
    role: 'Lead Designer',
    tools: ['Figma', 'Illustrator', 'After Effects'],
    color: '#c0392b',
    nextProject: '2'
  },
  '2': {
    id: '2',
    title: 'App Redesign',
    client: 'TechCo',
    year: '2024',
    duration: '12 weeks',
    role: 'UX/UI Designer',
    tools: ['Figma', 'Protopie', 'Miro'],
    color: '#8e44ad',
    nextProject: '3'
  },
  '3': {
    id: '3',
    title: 'Design System',
    client: 'Enterprise Inc',
    year: '2023',
    duration: '16 weeks',
    role: 'Systems Designer',
    tools: ['Figma', 'Storybook', 'Zeroheight'],
    color: '#d35400',
    nextProject: '4'
  }
};

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = caseStudies[params.slug];

  if (!project) {
    notFound();
  }

  const nextProject = caseStudies[project.nextProject];

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-end">
        {/* Full-bleed background (placeholder color) */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundColor: project.color }}
        />

        <div className="relative z-10 w-full px-8 md:px-16 pb-24">
          <Heading level={1} className="max-w-5xl">
            {project.title}
          </Heading>
        </div>
      </section>

      {/* Overview Section */}
      <section className="px-8 md:px-16 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <RevealText>
            <Eyebrow className="mb-6">Overview</Eyebrow>
            <BodyText className="text-xl md:text-2xl leading-relaxed mb-12 text-text-secondary">
              A comprehensive brand identity project that established a cohesive visual language
              across digital and print touchpoints, setting the foundation for long-term brand recognition.
            </BodyText>
          </RevealText>

          <RevealText delay={0.1}>
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <Eyebrow className="mb-3">Client</Eyebrow>
                <BodyText>{project.client}</BodyText>
              </div>
              <div>
                <Eyebrow className="mb-3">Year</Eyebrow>
                <BodyText>{project.year}</BodyText>
              </div>
              <div>
                <Eyebrow className="mb-3">Duration</Eyebrow>
                <BodyText>{project.duration}</BodyText>
              </div>
              <div>
                <Eyebrow className="mb-3">Role</Eyebrow>
                <BodyText>{project.role}</BodyText>
              </div>
            </div>
          </RevealText>

          <RevealText delay={0.2}>
            <Eyebrow className="mb-4">Tools</Eyebrow>
            <div className="flex gap-2 flex-wrap">
              {project.tools.map((tool: string) => (
                <PillTag key={tool}>{tool}</PillTag>
              ))}
            </div>
          </RevealText>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="px-8 md:px-16 py-24 md:py-32 bg-bg-secondary">
        <div className="max-w-4xl mx-auto">
          <RevealText>
            <Eyebrow className="mb-6">The Challenge</Eyebrow>
            <Heading level={2} className="mb-8">
              How do we create a brand that stands out in a crowded market?
            </Heading>
            <BodyText size="lg" className="text-text-secondary leading-relaxed">
              The client needed a fresh identity that would differentiate them from competitors while
              maintaining credibility in their industry. The existing brand felt dated and didn't reflect
              the innovative nature of their work.
            </BodyText>
          </RevealText>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-8 md:px-16 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <RevealText>
            <Eyebrow className="mb-6">Process</Eyebrow>
            <Heading level={2} className="mb-16">
              A methodical approach to brand development
            </Heading>
          </RevealText>

          {/* Step 1 */}
          <RevealText delay={0.1}>
            <div className="mb-16">
              <div className="flex items-start gap-6 mb-6">
                <span className="text-accent-primary font-serif text-4xl">01</span>
                <div>
                  <h3 className="font-serif text-2xl mb-4">Research & Discovery</h3>
                  <BodyText className="text-text-secondary">
                    We conducted stakeholder interviews, competitor analysis, and market research to
                    understand the landscape and identify opportunities for differentiation.
                  </BodyText>
                </div>
              </div>
              {/* Placeholder for image/wireframe */}
              <div className="w-full h-64 bg-bg-secondary rounded-lg mt-8" />
            </div>
          </RevealText>

          {/* Step 2 */}
          <RevealText delay={0.2}>
            <div className="mb-16">
              <div className="flex items-start gap-6 mb-6">
                <span className="text-accent-primary font-serif text-4xl">02</span>
                <div>
                  <h3 className="font-serif text-2xl mb-4">Concept Development</h3>
                  <BodyText className="text-text-secondary">
                    Multiple visual directions were explored, each with distinct personality traits
                    aligned to different strategic approaches.
                  </BodyText>
                </div>
              </div>
              <div className="w-full h-64 bg-bg-secondary rounded-lg mt-8" />
            </div>
          </RevealText>

          {/* Step 3 */}
          <RevealText delay={0.3}>
            <div className="mb-16">
              <div className="flex items-start gap-6 mb-6">
                <span className="text-accent-primary font-serif text-4xl">03</span>
                <div>
                  <h3 className="font-serif text-2xl mb-4">Refinement & Testing</h3>
                  <BodyText className="text-text-secondary">
                    The selected direction was refined through multiple iterations, testing across
                    various applications and touchpoints.
                  </BodyText>
                </div>
              </div>
              <div className="w-full h-64 bg-bg-secondary rounded-lg mt-8" />
            </div>
          </RevealText>
        </div>
      </section>

      {/* Design Decisions Section */}
      <section className="px-8 md:px-16 py-24 md:py-32 bg-bg-secondary">
        <div className="max-w-4xl mx-auto">
          <RevealText>
            <Eyebrow className="mb-6">Design Decisions</Eyebrow>
            <Heading level={2} className="mb-16">
              Key choices that shaped the outcome
            </Heading>
          </RevealText>

          <RevealText delay={0.1}>
            <div className="border-l-2 border-accent-primary pl-8 mb-12">
              <blockquote className="font-serif text-2xl md:text-3xl italic text-text-primary mb-4">
                "Every element needed to work as hard as the brand itself — no decoration without purpose."
              </blockquote>
            </div>
          </RevealText>

          <RevealText delay={0.2}>
            <BodyText size="lg" className="text-text-secondary leading-relaxed mb-8">
              The typography system was built around contrast: a bold, geometric sans-serif for headlines
              paired with a humanist serif for body copy. This combination conveyed both confidence and
              approachability.
            </BodyText>
            <div className="w-full h-96 bg-bg-primary rounded-lg mb-8" />
          </RevealText>

          <RevealText delay={0.3}>
            <BodyText size="lg" className="text-text-secondary leading-relaxed">
              The color palette drew inspiration from the client's industry roots while feeling fresh
              and contemporary. The primary blue anchors the system, supported by warm accent tones.
            </BodyText>
          </RevealText>
        </div>
      </section>

      {/* Outcome Section */}
      <section className="px-8 md:px-16 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <RevealText>
            <Eyebrow className="mb-6">Outcome</Eyebrow>
            <Heading level={2} className="mb-8">
              A cohesive system that scales
            </Heading>
            <BodyText size="lg" className="text-text-secondary leading-relaxed mb-12">
              The new brand identity was rolled out across all touchpoints including website,
              marketing materials, and product packaging. The client reported a 40% increase in
              brand recognition within the first six months.
            </BodyText>
          </RevealText>

          <RevealText delay={0.1}>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div>
                <div className="text-4xl font-serif text-accent-primary mb-2">40%</div>
                <BodyText className="text-text-tertiary">Increase in brand recognition</BodyText>
              </div>
              <div>
                <div className="text-4xl font-serif text-accent-primary mb-2">12+</div>
                <BodyText className="text-text-tertiary">Touchpoints designed</BodyText>
              </div>
              <div>
                <div className="text-4xl font-serif text-accent-primary mb-2">3</div>
                <BodyText className="text-text-tertiary">Brand guidelines delivered</BodyText>
              </div>
            </div>
          </RevealText>

          <RevealText delay={0.2}>
            <div className="w-full h-96 bg-bg-secondary rounded-lg" />
          </RevealText>
        </div>
      </section>

      {/* Next Project Section */}
      {nextProject && (
        <section className="px-8 md:px-16 py-24 md:py-32 bg-bg-secondary">
          <div className="max-w-4xl mx-auto">
            <RevealText>
              <Eyebrow className="mb-6">Next Project</Eyebrow>
              <div
                className="relative rounded-lg overflow-hidden h-96 group cursor-pointer"
                onClick={() => window.location.href = `/work/${nextProject.id}`}
              >
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundColor: nextProject.color, opacity: 0.3 }}
                />
                <div className="relative z-10 h-full flex items-end p-12">
                  <div>
                    <Heading level={2} className="mb-4">
                      {nextProject.title}
                    </Heading>
                    <Button href={`/work/${nextProject.id}`} arrow variant="primary">
                      View project
                    </Button>
                  </div>
                </div>
              </div>
            </RevealText>
          </div>
        </section>
      )}
    </main>
  );
}
