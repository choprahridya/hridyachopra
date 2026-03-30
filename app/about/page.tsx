'use client';

import { useState } from 'react';
import { Footer } from '@/components/Footer';
import { DividerMotif, RevealText, SkillRow, Button } from '@/components/ui';

const skills = [
  { name: 'Figma', level: 5 as const },
  { name: 'Illustrator', level: 4 as const },
  { name: 'After Effects', level: 3 as const },
  { name: 'Protopie', level: 3 as const },
  { name: 'Framer', level: 4 as const },
];

const expertise = {
  Design: ['UI/UX Design', 'Brand Identity', 'Design Systems', 'Visual Design', 'Interaction Design'],
  Strategy: ['User Research', 'Information Architecture', 'Content Strategy', 'Design Thinking'],
  Technical: ['Prototyping', 'Responsive Design', 'Accessibility', 'Design Ops'],
};

const experience = [
  { role: 'Senior Product Designer', company: 'Studio Name', period: '2023 – Present', desc: 'Led end-to-end design for core product and brand.' },
  { role: 'UX Designer', company: 'Agency Name', period: '2021 – 2023', desc: 'Designed digital products and brand identities for clients across fintech and consumer.' },
  { role: 'Junior Designer', company: 'First Company', period: '2020 – 2021', desc: 'Supported senior designers on web and brand projects.' },
];

const socialLinks = [
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'Dribbble', url: 'https://dribbble.com' },
  { name: 'Instagram', url: 'https://instagram.com' },
];

export default function AboutPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <main className="min-h-screen flex flex-col bg-bg pt-16">

      {/* ── Hero ── */}
      <section className="px-[--page-padding] pt-20 pb-16">
        <div className="max-w-site mx-auto">
          <RevealText>
            <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-4">
              About
            </p>
            <h1
              className="font-serif text-text-primary mb-6"
              style={{ fontSize: 'var(--text-h1)', lineHeight: 'var(--lh-tight)' }}
            >
              Designer at the intersection of<br />
              craft, empathy, and strategy
            </h1>
          </RevealText>
        </div>
      </section>

      <DividerMotif />

      {/* ── Bio sidebar layout ── */}
      <section className="px-[--page-padding] pb-24">
        <div className="max-w-site mx-auto grid md:grid-cols-[1fr_2fr] gap-16">

          {/* Sidebar */}
          <RevealText>
            <div className="flex flex-col items-start gap-6">
              <div
                className="w-40 h-40 rounded-full flex items-center justify-center text-text-muted text-sm font-sans"
                style={{ background: 'var(--color-bg-overlay)' }}
              >
                Photo
              </div>
              <div>
                <p className="font-serif text-[22px] text-text-primary mb-1">Hridya Chopra</p>
                <p className="text-[13px] text-text-secondary">UI/UX &amp; Brand Designer</p>
              </div>
              <div className="flex flex-col gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-text-secondary hover:text-text-primary transition-colors border-b border-transparent hover:border-text-secondary pb-px w-fit"
                  >
                    {link.name} →
                  </a>
                ))}
              </div>
              <Button href="/cv.pdf" external>Download CV →</Button>
            </div>
          </RevealText>

          {/* Bio content */}
          <RevealText delay={0.1}>
            <div className="space-y-5 text-[15px] text-text-secondary leading-[var(--lh-loose)]">
              <p>
                I'm a UI/UX &amp; brand designer who believes great work happens at the intersection
                of empathy, craft, and strategy.
              </p>
              <p>
                With over 5 years of experience, I've helped startups and established companies
                create meaningful digital experiences that scale and evolve.
              </p>
              <p>
                When I'm not designing, you'll find me exploring new coffee shops, reading about
                design history, or experimenting with generative art.
              </p>
            </div>
          </RevealText>
        </div>
      </section>

      <DividerMotif />

      {/* ── Skills ── */}
      <section className="px-[--page-padding] pb-24">
        <div className="max-w-site mx-auto">
          <RevealText className="mb-10">
            <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-3">
              Skills &amp; Expertise
            </p>
            <h2 className="font-serif text-[var(--text-h2)] text-text-primary">What I do</h2>
          </RevealText>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {Object.entries(expertise).map(([category, skillList], i) => (
              <RevealText key={category} delay={i * 0.08}>
                <h3 className="font-serif text-[var(--text-h3)] text-text-primary mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <span key={skill} className="pill">{skill}</span>
                  ))}
                </div>
              </RevealText>
            ))}
          </div>

          <RevealText delay={0.3}>
            <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-4">
              Tools
            </p>
            <div className="max-w-sm">
              {skills.map((skill) => (
                <SkillRow key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>
          </RevealText>
        </div>
      </section>

      <DividerMotif />

      {/* ── Experience ── */}
      <section className="px-[--page-padding] pb-24">
        <div className="max-w-site mx-auto">
          <RevealText className="mb-10">
            <h2 className="font-serif text-[var(--text-h2)] text-text-primary">Experience</h2>
          </RevealText>

          <div className="max-w-text">
            {experience.map((item, i) => (
              <RevealText key={item.role} delay={i * 0.08}>
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between py-5 border-b border-border gap-1">
                  <div>
                    <p className="font-serif text-[var(--text-h3)] text-text-primary">{item.role}</p>
                    <p className="text-[14px] text-text-secondary mt-0.5">{item.company} — {item.desc}</p>
                  </div>
                  <span className="text-[13px] text-text-muted font-sans tracking-[0.04em] whitespace-nowrap">{item.period}</span>
                </div>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      <DividerMotif />

      {/* ── Contact ── */}
      <section id="contact" className="px-[--page-padding] pb-24">
        <div className="max-w-text mx-auto text-center">
          <RevealText>
            <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-4">
              Get in Touch
            </p>
            <h2 className="font-serif text-[var(--text-h2)] text-text-primary mb-4">
              Let's work together
            </h2>
            <a
              href="mailto:hello@hridyachopra.com"
              className="font-serif text-[28px] text-accent hover:opacity-80 transition-opacity block mb-12"
            >
              hello@hridyachopra.com
            </a>
          </RevealText>

          <RevealText delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label htmlFor="name" className="block text-[13px] text-text-secondary mb-1.5">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-bg-card border border-border rounded-md text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-dark transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-[13px] text-text-secondary mb-1.5">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-bg-card border border-border rounded-md text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-dark transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-[13px] text-text-secondary mb-1.5">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 bg-bg-card border border-border rounded-md text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-dark transition-colors resize-none"
                />
              </div>
              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3 border border-text-primary rounded-pill text-[13px] font-medium text-text-primary tracking-[0.04em] transition-colors hover:bg-text-primary hover:text-bg"
                >
                  Send Message →
                </button>
              </div>
            </form>
          </RevealText>
        </div>
      </section>

      <Footer />
    </main>
  );
}
