'use client';

import { useState } from 'react';
import { Footer } from '@/components/Footer';
import { DividerMotif, RevealText, SkillRow, Button } from '@/components/ui';

const skills = [
  { name: 'Figma', level: 4 as const },
  { name: 'Illustrator', level: 3 as const },
  { name: 'Canva', level: 5 as const },
  { name: 'Photoshop', level: 4 as const },
  { name: 'JavaScript', level: 3 as const },
];

const expertise = {
  Design: ['UX Design', 'Design Thinking', 'Visual Design', 'Prototyping', 'Interaction Design'],
  Strategy: ['User Research', 'Digital Marketing', 'Content Strategy', 'Brand Identity', 'SEO'],
  Technical: ['Figma', 'Adobe Suite', 'Canva', 'JavaScript', 'App Prototyping'],
};

export default function AboutPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-bg pt-16">

      {/* ── Hero ── */}
      <section className="px-[--page-padding] pt-10 pb-10">
        <div className="max-w-site mx-auto">

          {/* "About" label at top */}
          <RevealText className="mb-14">
            <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans">
              About
            </p>
          </RevealText>

          {/* Two-column content */}
          <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start">

          {/* Left — photo + identity */}
          <RevealText>
            <div className="flex flex-col items-start gap-4">
              <div className="w-36 h-36 rounded-full overflow-hidden">
                <img src="/about-hridya.jpg" alt="Hridya Chopra" className="w-full h-full object-cover" style={{ objectPosition: '50% 15%' }} />
              </div>
              <div>
                <p className="font-serif text-[20px] text-text-primary leading-tight">Hridya Chopra</p>
                <p className="text-[13px] text-text-secondary mt-0.5">UX Designer · SCAD '29</p>
              </div>
              <a
                href="https://www.linkedin.com/in/hridyachopra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-text-secondary hover:text-text-primary transition-colors border-b border-transparent hover:border-text-secondary pb-px"
              >
                LinkedIn →
              </a>
            </div>
          </RevealText>

          {/* Right — heading + bio */}
          <RevealText delay={0.1}>
            <div className="flex flex-col gap-5">
              <h1
                className="font-serif text-text-primary"
                style={{ fontSize: 'var(--text-h1)', lineHeight: 'var(--lh-tight)' }}
              >
                Designing the pieces<br />
                that come together to<br />
                create meaningful experiences.
              </h1>
              <p className="text-[15px] text-text-secondary leading-[var(--lh-loose)] max-w-prose">
                I work across UX design, digital marketing, and visual identity. My tools of choice
                are Figma, Illustrator, and Photoshop. Always looking for projects where good
                design genuinely changes something.
              </p>
            </div>
          </RevealText>

          </div>
        </div>
      </section>

      <DividerMotif />

      {/* ── Skills ── */}
      <section className="px-[--page-padding] py-12">
        <div className="max-w-site mx-auto">
          <RevealText className="mb-8">
            <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-2">
              Skills &amp; Expertise
            </p>
            <h2 className="font-serif text-[var(--text-h2)] text-text-primary">What I do</h2>
          </RevealText>

          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
            {/* Expertise pills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(expertise).map(([category, skillList], i) => (
                <RevealText key={category} delay={i * 0.08}>
                  <h3 className="font-serif text-[var(--text-h3)] text-text-primary mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => (
                      <span key={skill} className="pill">{skill}</span>
                    ))}
                  </div>
                </RevealText>
              ))}
            </div>

            {/* Tool bars */}
            <RevealText delay={0.2}>
              <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-4">
                Tools
              </p>
              {skills.map((skill) => (
                <SkillRow key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </RevealText>
          </div>
        </div>
      </section>

      <DividerMotif />

      {/* ── Contact ── */}
      <section id="contact" className="px-[--page-padding] py-14">
        <div className="max-w-site mx-auto grid md:grid-cols-2 gap-16 items-start">

          {/* Left — heading + email */}
          <RevealText>
            <p className="text-[var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans mb-4">
              Get in Touch
            </p>
            <h2 className="font-serif text-[var(--text-h2)] text-text-primary mb-6">
              Let's work together
            </h2>
            <a
              href="mailto:choprahridya@gmail.com"
              className="font-serif text-[22px] text-accent hover:opacity-80 transition-opacity block"
            >
              choprahridya@gmail.com →
            </a>
          </RevealText>

          {/* Right — form */}
          <RevealText delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 bg-bg-card border border-border rounded-md text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-dark transition-colors resize-none"
                />
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  type="submit"
                  disabled={status === 'sending' || status === 'sent'}
                  className="inline-flex items-center gap-2 px-7 py-3 border border-text-primary rounded-pill text-[13px] font-medium text-text-primary tracking-[0.04em] transition-colors hover:bg-text-primary hover:text-bg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : 'Send Message →'}
                </button>
                {status === 'error' && (
                  <p className="text-[13px] text-red-500">Something went wrong — try emailing directly.</p>
                )}
              </div>
            </form>
          </RevealText>
        </div>
      </section>

      <Footer />
    </main>
  );
}
