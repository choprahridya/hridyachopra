'use client';

import { Heading, BodyText, PillTag, Button } from '@/components/ui';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-primary">
      {/* Gradient glow overlay */}
      <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />

      {/* Hero Section */}
      <motion.div
        className="min-h-screen flex flex-col justify-center px-8 md:px-16 relative z-10"
        style={{ opacity: Math.max(0, 1 - scrollY / 400) }}
      >
        <div className="max-w-7xl mx-auto w-full relative">
          {/* Asterisk decorators */}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="absolute -top-8 left-0 text-accent-primary text-2xl"
          >
            ✳
          </motion.span>

          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute top-12 -right-4 md:right-20 text-accent-primary text-xl opacity-60"
          >
            ✳
          </motion.span>

          {/* Main name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <Heading level={1} className="relative inline-block text-gradient glow-accent">
              hridyachopra
            </Heading>
          </motion.div>

          {/* Scattered metadata labels */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute top-0 right-0 md:right-32 text-xs text-text-tertiary tracking-wider hidden md:block"
          >
            — UI/UX · Brand · 2025
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <BodyText className="text-text-secondary max-w-2xl text-lg md:text-xl">
              UI/UX & brand designer crafting considered digital experiences
            </BodyText>
          </motion.div>

          {/* Floating pill tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex gap-3 mb-16 flex-wrap"
          >
            <PillTag>UI/UX</PillTag>
            <PillTag>Brand</PillTag>
            <PillTag>Strategy</PillTag>
            <PillTag variant="filled">Available</PillTag>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4 flex-wrap"
          >
            <Button href="/work" arrow>View Work</Button>
            <Button href="/about" variant="ghost">About Me</Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-xs text-text-tertiary tracking-wider uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-px h-16 bg-gradient-to-b from-text-tertiary to-transparent"
          />
        </motion.div>
      </motion.div>

      {/* Additional content section (to enable scrolling) */}
      <div className="min-h-screen flex items-center justify-center px-8 md:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              Selected Work
            </h2>
            <BodyText className="text-text-secondary mb-8">
              A curated collection of projects spanning brand identity,
              user experience design, and digital strategy.
            </BodyText>
            <Button href="/work" arrow>Explore Projects</Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
