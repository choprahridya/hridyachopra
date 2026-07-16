'use client';

import { Heading, Eyebrow, BodyText, PillTag, Button, RevealText } from '@/components/ui';

const skills = {
  'Design': ['UI/UX Design', 'Brand Identity', 'Design Systems', 'Visual Design', 'Interaction Design'],
  'Strategy': ['User Research', 'Information Architecture', 'Content Strategy', 'Design Thinking'],
  'Technical': ['Prototyping', 'Responsive Design', 'Accessibility', 'Design Ops']
};

const tools = [
  'Figma',
  'Adobe CC',
  'Sketch',
  'Protopie',
  'Framer',
  'Miro',
  'Notion',
  'After Effects'
];

const socialLinks = [
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'Dribbble', url: 'https://dribbble.com' },
  { name: 'Twitter', url: 'https://twitter.com' },
  { name: 'Instagram', url: 'https://instagram.com' }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg pt-32 pb-24 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <RevealText>
          <Eyebrow className="mb-6 text-accent">
            About Me ★
          </Eyebrow>
          <Heading level={1} className="mb-16 max-w-4xl">
            Designer crafting
            <br />
            <span className="text-accent">
              bold experiences
            </span>
          </Heading>
        </RevealText>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 mb-24">
          {/* Left column - Bio */}
          <div>
            <RevealText delay={0.1}>
              <div className="space-y-6">
                <BodyText size="lg" className="text-text-secondary leading-relaxed">
                  I'm a UI/UX & brand designer who believes great work happens at the intersection
                  of <span className="text-accent">empathy</span>,
                  <span className="text-accent"> craft</span>, and
                  <span className="text-accent"> strategy</span>.
                </BodyText>
                <BodyText size="lg" className="text-text-secondary leading-relaxed">
                  With over 5 years of experience, I've helped startups and established companies
                  create meaningful digital experiences that scale and evolve.
                </BodyText>
                <BodyText size="lg" className="text-text-secondary leading-relaxed">
                  When I'm not designing, you'll find me exploring new coffee shops, reading about
                  design history, or experimenting with generative art.
                </BodyText>
              </div>
            </RevealText>
          </div>

          {/* Right column - Small circular photo */}
          <div>
            <RevealText delay={0.2}>
              <div className="relative w-48 h-48">
                {/* Soft blue glow */}
                <div className="absolute -inset-2 rounded-full opacity-30 blur-xl"
                     style={{
                       background: `linear-gradient(135deg, var(--color-accent), var(--color-text-secondary))`
                     }}
                />

                {/* Photo placeholder */}
                <div className="relative w-48 h-48 bg-bg-card rounded-full overflow-hidden border-4 border-accent">
                  <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm text-center px-4">
                    [Portrait photo]
                  </div>
                </div>
              </div>
            </RevealText>
          </div>
        </div>

        {/* Skills section */}
        <RevealText delay={0.3}>
          <div className="mb-24">
            <Eyebrow className="mb-8 text-accent">
              Skills & Expertise
            </Eyebrow>

            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(skills).map(([category, skillList]) => (
                <div key={category} className="p-8 rounded-xl border-2 border-border bg-bg-card hover:border-accent transition-all duration-300 hover:scale-[1.02]">
                  <h3 className="font-serif text-2xl mb-6 text-accent">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => (
                      <PillTag key={skill}>{skill}</PillTag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealText>

        {/* Tools */}
        <RevealText delay={0.4}>
          <div className="mb-24">
            <Eyebrow className="mb-8 text-accent">
              Tools I Love
            </Eyebrow>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tools.map((tool) => (
                <div
                  key={tool}
                  className="px-6 py-4 rounded-lg font-bold text-sm uppercase tracking-wider text-center text-accent bg-accent-light transition-all hover:scale-105 hover:shadow-xl"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </RevealText>

        {/* How I work - card contrast */}
        <div className="bg-bg-card rounded-2xl p-12 md:p-16 mb-24 border-4 border-accent">
          <RevealText delay={0.5}>
            <Eyebrow className="mb-6 text-accent">
              How I Work
            </Eyebrow>
            <h2 className="font-serif text-4xl md:text-5xl mb-8 text-text-primary">
              Collaboration over ego.
              <br />
              Outcomes over outputs.
            </h2>
            <BodyText className="text-text-secondary leading-relaxed mb-6 text-lg">
              I believe in iteration over perfection. My process is flexible but always starts
              with understanding the problem deeply before jumping to solutions.
            </BodyText>
            <BodyText className="text-text-secondary leading-relaxed text-lg">
              I work best in environments that value curiosity, experimentation, and thoughtful critique.
              I'm comfortable wearing multiple hats and bridging the gap between design, product, and engineering.
            </BodyText>
          </RevealText>
        </div>

        {/* Bottom CTA section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <RevealText delay={0.6}>
            <div>
              <Button href="/cv.pdf" arrow>
                Download CV
              </Button>
            </div>
          </RevealText>

          <RevealText delay={0.7}>
            <div>
              <Eyebrow className="mb-4 text-accent">
                Connect
              </Eyebrow>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-accent transition-colors font-medium relative group text-sm"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </RevealText>
        </div>
      </div>
    </main>
  );
}
