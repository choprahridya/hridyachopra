'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface Project {
  id: string;
  title: string;
  thumbnail: string;
  color: string;
}

interface DiscProps {
  projects: Project[];
  onActiveProjectChange?: (project: Project) => void;
}

export function Disc({ projects, onActiveProjectChange }: DiscProps) {
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const discRef = useRef<HTMLDivElement>(null);
  const lastMouseY = useRef(0);
  const animationFrame = useRef<number | undefined>(undefined);

  const discRadius = 210;
  const thumbnailOrbitRadius = 155;
  const thumbnailSize = 88;
  const thumbnailSizeInactive = 62;

  useEffect(() => {
    const animate = () => {
      if (!isDragging && Math.abs(velocity) > 0.2) {
        setRotation((prev) => prev + velocity);
        setVelocity((prev) => prev * 0.93);
      }
      animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);
    return () => { if (animationFrame.current) cancelAnimationFrame(animationFrame.current); };
  }, [velocity, isDragging]);

  useEffect(() => {
    const anglePerProject = 360 / projects.length;
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    let closestIndex = 0;
    let minDiff = 360;
    projects.forEach((_, index) => {
      const thumbnailAngle = (index * anglePerProject - normalizedRotation + 360) % 360;
      const diff = Math.min(Math.abs(thumbnailAngle - 270), 360 - Math.abs(thumbnailAngle - 270));
      if (diff < minDiff) { minDiff = diff; closestIndex = index; }
    });
    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
      onActiveProjectChange?.(projects[closestIndex]);
    }
  }, [rotation, projects, activeIndex, onActiveProjectChange]);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.3;
    setRotation((prev) => prev + delta);
    setVelocity(delta);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMouseY.current = e.clientY;
    setVelocity(0);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const delta = (lastMouseY.current - e.clientY) * 0.5;
    setRotation((prev) => prev + delta);
    setVelocity(delta);
    lastMouseY.current = e.clientY;
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    lastMouseY.current = e.touches[0].clientY;
    setVelocity(0);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const delta = (lastMouseY.current - e.touches[0].clientY) * 0.5;
    setRotation((prev) => prev + delta);
    setVelocity(delta);
    lastMouseY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => setIsDragging(false);

  useEffect(() => {
    const disc = discRef.current;
    if (!disc) return;
    disc.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      disc.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  });

  return (
    <div
      ref={discRef}
      className="relative w-[420px] h-[420px] select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* SVG disc — cream/ink palette */}
      <motion.svg
        width="420"
        height="420"
        viewBox="0 0 420 420"
        style={{ rotate: rotation }}
        className="absolute inset-0 drop-shadow-lg"
      >
        <defs>
          <radialGradient id="discGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EFECEA" />
            <stop offset="100%" stopColor="#E2DED7" />
          </radialGradient>
        </defs>

        {/* Disc body */}
        <circle cx="210" cy="210" r="210" fill="url(#discGradient)" stroke="#D4D0C9" strokeWidth="1" />

        {/* Grooves */}
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx="210"
            cy="210"
            r={190 - i * 5}
            fill="none"
            stroke="rgba(17,17,17,0.05)"
            strokeWidth="0.5"
          />
        ))}

        {/* Center hole */}
        <circle cx="210" cy="210" r="16" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="1" />
      </motion.svg>

      {/* Thumbnails */}
      {projects.map((project, index) => {
        const anglePerProject = 360 / projects.length;
        const angle = (index * anglePerProject + rotation) * (Math.PI / 180);
        const x = discRadius + Math.cos(angle) * thumbnailOrbitRadius;
        const y = discRadius + Math.sin(angle) * thumbnailOrbitRadius;
        const isActive = index === activeIndex;

        return (
          <motion.div
            key={project.id}
            className="absolute"
            style={{ left: x, top: y, x: '-50%', y: '-50%' }}
            animate={{
              width: isActive ? thumbnailSize : thumbnailSizeInactive,
              height: isActive ? thumbnailSize : thumbnailSizeInactive,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div
              className={`w-full h-full rounded-xl overflow-hidden transition-all duration-300 ${
                isActive ? 'scale-105' : 'opacity-60 hover:opacity-80'
              }`}
              style={{
                outline: isActive
                  ? '2px solid var(--color-accent)'
                  : '1px solid var(--color-border)',
                boxShadow: isActive ? '0 4px 16px rgba(61,107,79,0.15)' : 'none',
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center text-[11px] font-medium text-text-secondary font-sans"
                style={{ backgroundColor: 'var(--color-bg-overlay)' }}
              >
                {project.title.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
