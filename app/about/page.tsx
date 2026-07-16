'use client';

import { Heading, Eyebrow, BodyText, PillTag, RevealText } from '@/components/ui';

const skills = [
  'UX Research',
  'Information Architecture',
  'Wire Framing',
  'Prototyping',
  'Testing',
  'Design Systems',
  'AI-assisted Design'
];

const tools = [
  'Figma',
  'Claude',
  'Adobe Photoshop',
  'Adobe Illustrator',
  'Canva',
  'Rhino',
  'Keyshot'
];

const socialLinks = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/hridyachopra' }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg pt-32 pb-24 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Hero - heading left, small photo aligned top-right */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-16">
          <RevealText className="flex-1">
            <Eyebrow className="mb-6 text-accent">
              About Me ★
            </Eyebrow>
            <Heading level={1}>
              Designer crafting{' '}
              <span className="text-accent">
                bold experiences
              </span>
            </Heading>
          </RevealText>

          <RevealText delay={0.2}>
            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
              {/* Soft blue glow */}
              <div className="absolute -inset-2 rounded-full opacity-30 blur-xl"
                   style={{
                     background: `linear-gradient(135deg, var(--color-accent), var(--color-text-secondary))`
                   }}
              />

              {/* Photo placeholder */}
              <div className="relative w-full h-full bg-bg-card rounded-full overflow-hidden border-4 border-accent">
                <div className="absolute inset-0 flex items-center justify-center text-text-muted text-xs text-center px-2">
                  [Portrait photo]
                </div>
              </div>
            </div>
          </RevealText>
        </div>

        {/* Bio */}
        <RevealText delay={0.1}>
          <div className="space-y-6 max-w-2xl mb-24">
            <BodyText size="lg" className="text-text-secondary leading-relaxed">
              I'm a BFA UX Design student at <span className="text-accent">SCAD</span>, currently
              interning as a <span className="text-accent">UX Design Intern at Ixigo</span>, where
              I design wireframes and high-fidelity interfaces for airport cab booking experiences.
            </BodyText>
            <BodyText size="lg" className="text-text-secondary leading-relaxed">
              Outside of coursework, I co-founded <span className="text-accent">KitabX</span>, a
              book exchange movement that's exchanged 25,000+ books, saved $50K+ and 400+ trees,
              and been recognized by IIT Kanpur, Plaksha University, and Youth Ki Awaaz.
            </BodyText>
            <BodyText size="lg" className="text-text-secondary leading-relaxed">
              I hold a Google UX Design Professional Certificate and I'm always looking for
              projects where good design genuinely changes something.
            </BodyText>
          </div>
        </RevealText>

        {/* Skills section */}
        <RevealText delay={0.3}>
          <div className="mb-24">
            <Eyebrow className="mb-8 text-accent">
              Skills & Expertise
            </Eyebrow>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <PillTag key={skill}>{skill}</PillTag>
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
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
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
