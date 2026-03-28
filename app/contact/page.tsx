'use client';

import { Heading, BodyText, Button, RevealText } from '@/components/ui';
import { useState } from 'react';

const socialLinks = [
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'Dribbble', url: 'https://dribbble.com' },
  { name: 'Twitter', url: 'https://twitter.com' },
  { name: 'Instagram', url: 'https://instagram.com' }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will go here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-3xl mx-auto text-center">
        <RevealText>
          <Heading level={1} className="mb-8">
            Let's work together
          </Heading>
        </RevealText>

        <RevealText delay={0.1}>
          <BodyText size="lg" className="mb-12 text-text-secondary">
            Have a project in mind or just want to chat about design?
            I'd love to hear from you.
          </BodyText>
        </RevealText>

        {/* Email Address */}
        <RevealText delay={0.2}>
          <div className="mb-16">
            <a
              href="mailto:hello@hridyachopra.com"
              className="inline-block text-2xl md:text-3xl font-serif text-accent-primary hover:text-accent-highlight transition-colors"
            >
              hello@hridyachopra.com
            </a>
          </div>
        </RevealText>

        {/* Contact Form */}
        <RevealText delay={0.3}>
          <form onSubmit={handleSubmit} className="space-y-6 text-left mb-16">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm text-text-secondary mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-md focus:border-border-strong focus:outline-none transition-colors text-text-primary"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-text-secondary mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-md focus:border-border-strong focus:outline-none transition-colors text-text-primary"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm text-text-secondary mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-md focus:border-border-strong focus:outline-none transition-colors text-text-primary resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button type="submit" variant="primary">
                Send Message
              </Button>
            </div>
          </form>
        </RevealText>

        {/* Social Links */}
        <RevealText delay={0.4}>
          <div>
            <BodyText className="mb-6 text-text-tertiary">Or find me on</BodyText>
            <div className="flex justify-center gap-6 flex-wrap">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-text-primary transition-colors relative group"
                >
                  <span>{link.name}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-current group-hover:w-full transition-all duration-200" />
                </a>
              ))}
            </div>
          </div>
        </RevealText>
      </div>
    </main>
  );
}
