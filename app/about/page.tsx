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
    <main className="min-h-screen pt-32 pb-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <RevealText>
          <Eyebrow className="mb-6">About</Eyebrow>
          <Heading level={1} className="mb-24 max-w-4xl">
            UI/UX & brand designer based in [Location], crafting digital experiences that matter.
          </Heading>
        </RevealText>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left column - Photo */}
          <div>
            <RevealText delay={0.1}>
              <div className="relative">
                {/* Soft color aura behind photo */}
                <div className="absolute -inset-8 bg-accent-primary/10 blur-3xl rounded-full" />

                {/* Photo placeholder */}
                <div className="relative aspect-[3/4] bg-bg-secondary rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-text-tertiary">
                    [Portrait photo]
                  </div>
                </div>
              </div>
            </RevealText>
          </div>

          {/* Right column - Content */}
          <div className="space-y-16">
            {/* Bio */}
            <RevealText delay={0.2}>
              <div>
                <BodyText size="lg" className="mb-6 text-text-secondary leading-relaxed">
                  I'm a designer who believes great work happens at the intersection of empathy,
                  craft, and strategy. With over 5 years of experience, I've helped startups and
                  established companies create meaningful digital experiences.
                </BodyText>
                <BodyText size="lg" className="mb-6 text-text-secondary leading-relaxed">
                  My approach is rooted in understanding people — their needs, behaviors, and contexts.
                  I don't just design interfaces; I design systems that scale and evolve.
                </BodyText>
                <BodyText size="lg" className="text-text-secondary leading-relaxed">
                  When I'm not designing, you'll find me exploring new coffee shops, reading about
                  design history, or experimenting with generative art.
                </BodyText>
              </div>
            </RevealText>

            {/* Skills */}
            <RevealText delay={0.3}>
              <div>
                <Eyebrow className="mb-6">Skills</Eyebrow>
                <div className="space-y-8">
                  {Object.entries(skills).map(([category, skillList]) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium mb-3 text-text-secondary">{category}</h3>
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
              <div>
                <Eyebrow className="mb-6">Tools</Eyebrow>
                <div className="grid grid-cols-2 gap-4">
                  {tools.map((tool) => (
                    <div
                      key={tool}
                      className="px-4 py-3 bg-bg-secondary rounded-md border border-border hover:border-border-strong transition-colors"
                    >
                      <span className="text-sm">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealText>

            {/* How I work */}
            <RevealText delay={0.5}>
              <div>
                <Eyebrow className="mb-6">How I work</Eyebrow>
                <BodyText className="text-text-secondary leading-relaxed mb-6">
                  I believe in collaboration over ego, iteration over perfection, and outcomes over outputs.
                  My process is flexible but always starts with understanding the problem deeply before
                  jumping to solutions.
                </BodyText>
                <BodyText className="text-text-secondary leading-relaxed">
                  I work best in environments that value curiosity, experimentation, and thoughtful critique.
                  I'm comfortable wearing multiple hats and bridging the gap between design, product, and engineering.
                </BodyText>
              </div>
            </RevealText>

            {/* CV Download */}
            <RevealText delay={0.6}>
              <div>
                <Button href="/cv.pdf" arrow>
                  Download CV
                </Button>
              </div>
            </RevealText>

            {/* Social Links */}
            <RevealText delay={0.7}>
              <div>
                <Eyebrow className="mb-6">Connect</Eyebrow>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary hover:text-text-primary transition-colors relative group"
                    >
                      <span className="text-sm">{link.name}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-current group-hover:w-full transition-all duration-200" />
                    </a>
                  ))}
                </div>
              </div>
            </RevealText>
          </div>
        </div>
      </div>
    </main>
  );
}
