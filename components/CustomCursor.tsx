'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [rotation, setRotation] = useState(0);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const lastPos = useRef({ x: 0, y: 0 });
  const rotRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setIsMounted(true);

    const updatePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Accumulate rotation based on movement speed
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      rotRef.current += speed * 1.2;
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    // Smooth the rotation update via rAF
    const tick = () => {
      setRotation(rotRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        !!(target.closest('a') || target.closest('button') || target.dataset.cursor === 'hover')
      );
    };

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', handleOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', handleOver);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cursorX, cursorY]);

  if (!isMounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] select-none"
      style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.span
        className="block leading-none text-text-primary font-sans"
        animate={{
          fontSize: isHovering ? '42px' : '28px',
          opacity: isHovering ? 0.9 : 0.55,
          rotate: rotation,
        }}
        transition={{
          fontSize: { type: 'spring', damping: 20, stiffness: 300 },
          opacity: { duration: 0.15 },
          rotate: { type: 'tween', duration: 0, ease: 'linear' },
        }}
      >
        *
      </motion.span>
    </motion.div>
  );
}
