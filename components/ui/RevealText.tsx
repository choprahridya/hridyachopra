'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as any
    }
  }
};

export function RevealText({ children, className = '', delay = 0 }: RevealTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={revealVariants}
      style={{ transitionDelay: `${delay}s` }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
