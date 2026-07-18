'use client';

import { PillTag, RevealText } from '@/components/ui';
import { Footer } from '@/components/Footer';

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

const education = [
  {
    period: '2025 - 2029',
    school: 'SCAD (Savannah College of Art and Design)',
    detail: "BFA UX Design · 3.77 GPA (Dean's List)"
  },
  {
    period: '2019 - 2025',
    school: 'HXLS (Heritage Xperiential Learning School)',
    detail: 'PCM (CBSE) · Grade 12: 88%, Grade 10: 86%'
  }
];

const experience = [
  {
    period: 'June 2026 - Present',
    role: 'UX Design Intern',
    company: 'Ixigo',
    description: "Designed wireframes & high-fidelity interfaces for airport cab booking experiences, including Live Activity notifications, ensuring consistency with Ixigo's design system."
  },
  {
    period: 'Apr - Jun 2025',
    role: 'Social Media Intern',
    company: 'Social Panga',
    description: 'Designed user-focused social media assets aligned with brand guidelines, improving engagement consistency across clients.'
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-bg">
      <section className="flex-1 flex flex-col justify-center min-h-screen px-8 md:px-16 lg:px-24 pt-32 pb-24">
      <div className="max-w-7xl mx-auto w-full">
      <div className="grid md:grid-cols-[300px_1fr] gap-16 lg:gap-24">

        {/* Left column - photo, contact, skills */}
        <div>
          <RevealText>
            <div className="relative w-full max-w-[260px]">
              {/* Decorative star accent */}
              <svg className="absolute -bottom-3 -right-3 z-10" width="40" height="40" viewBox="0 0 24 24" fill="var(--color-accent)">
                <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
              </svg>

              {/* Photo */}
              <div className="relative aspect-[3/4] bg-bg-card rounded-2xl overflow-hidden border-2 border-border">
                <img src="/about-portrait.jpg" alt="Hridya Chopra" className="w-full h-full object-cover" />
              </div>
            </div>
          </RevealText>

          {/* Contact */}
          <RevealText delay={0.1}>
            <div className="mt-8 space-y-2 text-[length:var(--text-body)]">
              <p className="text-text-secondary">
                <span className="font-bold text-text-primary">Phone: </span>
                +1 912 220 4951
              </p>
              <p className="text-text-secondary">
                <span className="font-bold text-text-primary">Email: </span>
                choprahridya@gmail.com
              </p>
              <p className="text-text-secondary">
                <span className="font-bold text-text-primary">LinkedIn: </span>
                <a
                  href="https://www.linkedin.com/in/hridyachopra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  hridyachopra
                </a>
              </p>
            </div>
          </RevealText>

          {/* Skills */}
          <RevealText delay={0.2}>
            <div className="mt-10">
              <p className="text-[length:var(--text-small)] font-extrabold uppercase tracking-[0.08em] text-accent mb-4">
                Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <PillTag key={skill}>{skill}</PillTag>
                ))}
              </div>
            </div>
          </RevealText>

          {/* Tools */}
          <RevealText delay={0.3}>
            <div className="mt-10">
              <p className="text-[length:var(--text-small)] font-extrabold uppercase tracking-[0.08em] text-accent mb-4">
                Tools
              </p>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <PillTag key={tool}>{tool}</PillTag>
                ))}
              </div>
            </div>
          </RevealText>
        </div>

        {/* Right column - about, education, experience */}
        <div>
          {/* About Me */}
          <RevealText>
            <h2 className="font-serif text-[length:var(--text-h2)] text-accent mb-6">
              About Me
            </h2>
            <div className="border-l-4 border-border-dark pl-6 space-y-4 mb-16">
              <p className="font-sans text-[length:var(--text-body)] text-text-secondary leading-relaxed">
                I'm a BFA UX Design student at SCAD, currently interning as a UX Design Intern at
                Ixigo, where I design wireframes and high-fidelity interfaces for airport cab
                booking experiences.
              </p>
              <p className="font-sans text-[length:var(--text-body)] text-text-secondary leading-relaxed">
                Outside of coursework, I co-founded KitabX, a book exchange movement that's
                exchanged 25,000+ books, saved $50K+ and 400+ trees, and been recognized by IIT
                Kanpur, Plaksha University, and Youth Ki Awaaz.
              </p>
              <p className="font-sans text-[length:var(--text-body)] text-text-secondary leading-relaxed">
                I hold a Google UX Design Professional Certificate and I'm always looking for
                projects where good design genuinely changes something.
              </p>
            </div>
          </RevealText>

          {/* Education */}
          <RevealText delay={0.1}>
            <h2 className="font-serif text-[length:var(--text-h2)] text-accent mb-8">
              Education
            </h2>
            <div className="border-l-2 border-border space-y-8 mb-16">
              {education.map((item) => (
                <div key={item.school} className="pl-6 relative">
                  <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-accent" />
                  <p className="text-[length:var(--text-pill)] uppercase tracking-wide text-text-muted mb-1">{item.period}</p>
                  <p className="font-serif text-[length:var(--text-h3)] text-text-primary">{item.school}</p>
                  <p className="text-[length:var(--text-small)] text-text-secondary">{item.detail}</p>
                </div>
              ))}
            </div>
          </RevealText>

          {/* Experience */}
          <RevealText delay={0.2}>
            <h2 className="font-serif text-[length:var(--text-h2)] text-accent mb-8">
              Experience
            </h2>
            <div className="border-l-2 border-border space-y-8">
              {experience.map((item) => (
                <div key={item.company} className="pl-6 relative">
                  <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-accent" />
                  <p className="text-[length:var(--text-pill)] uppercase tracking-wide text-text-muted mb-1">{item.period}</p>
                  <p className="font-serif text-[length:var(--text-h3)] text-text-primary">{item.role}</p>
                  <p className="text-[length:var(--text-small)] text-accent italic mb-2">{item.company}</p>
                  <p className="text-[length:var(--text-small)] text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </RevealText>
        </div>
      </div>
      </div>
      </section>

      {/* Connect - full width section, own div from the footer */}
      <section className="px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto w-full">
          <RevealText delay={0.3}>
            <div className="mt-8 pt-12 border-t border-border pb-24">
              <h2 className="font-serif text-[length:var(--text-h2)] text-accent mb-3">
                Want to connect?
              </h2>
              <p className="text-text-secondary mb-6 max-w-prose">
                Always happy to talk design, opportunities, or anything in between.
              </p>
              <a
                href="mailto:choprahridya@gmail.com"
                className="font-serif text-[22px] text-accent hover:opacity-80 transition-opacity"
              >
                choprahridya@gmail.com →
              </a>
            </div>
          </RevealText>
        </div>
      </section>

      <Footer />
    </main>
  );
}
