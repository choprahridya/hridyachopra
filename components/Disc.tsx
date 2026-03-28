'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface Project {
  id: string;
  title: string;
  thumbnail: string;
  color: string; // Placeholder color
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

  const discRadius = 210; // Half of 420px disc
  const thumbnailOrbitRadius = 155; // Distance from center
  const thumbnailSize = 88; // Active thumbnail size
  const thumbnailSizeInactive = 62; // Inactive thumbnail size

  // Apply momentum physics
  useEffect(() => {
    const animate = () => {
      if (!isDragging && Math.abs(velocity) > 0.2) {
        setRotation((prev) => prev + velocity);
        setVelocity((prev) => prev * 0.93); // Momentum decay
      }
      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [velocity, isDragging]);

  // Detect active thumbnail (closest to 270° / top position)
  useEffect(() => {
    const anglePerProject = 360 / projects.length;
    const normalizedRotation = ((rotation % 360) + 360) % 360;

    // Find which thumbnail is closest to 270° (top)
    let closestIndex = 0;
    let minDiff = 360;

    projects.forEach((_, index) => {
      const thumbnailAngle = (index * anglePerProject - normalizedRotation + 360) % 360;
      const diff = Math.abs(thumbnailAngle - 270);
      const wrappedDiff = Math.min(diff, 360 - diff);

      if (wrappedDiff < minDiff) {
        minDiff = wrappedDiff;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
      onActiveProjectChange?.(projects[closestIndex]);
    }
  }, [rotation, projects, activeIndex, onActiveProjectChange]);

  // Mouse wheel handler
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.3;
    setRotation((prev) => prev + delta);
    setVelocity(delta);
  };

  // Mouse drag handlers
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
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

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

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
      {/* SVG Disc */}
      <motion.svg
        width="420"
        height="420"
        viewBox="0 0 420 420"
        style={{ rotate: rotation }}
        className="absolute inset-0"
      >
        {/* Outer disc */}
        <circle
          cx="210"
          cy="210"
          r="210"
          fill="var(--color-bg-secondary)"
          stroke="var(--color-border-strong)"
          strokeWidth="1"
        />

        {/* Grooves - concentric circles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx="210"
            cy="210"
            r={190 - i * 5}
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="0.5"
          />
        ))}

        {/* Center hole */}
        <circle
          cx="210"
          cy="210"
          r="16"
          fill="var(--color-bg-primary)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
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
            style={{
              left: x,
              top: y,
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              width: isActive ? thumbnailSize : thumbnailSizeInactive,
              height: isActive ? thumbnailSize : thumbnailSizeInactive,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div
              className={`w-full h-full rounded-[14px] overflow-hidden transition-all ${
                isActive ? 'ring-2 ring-white shadow-lg' : 'ring-1 ring-border opacity-70'
              }`}
            >
              {/* Placeholder with color */}
              <div
                className="w-full h-full flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: project.color }}
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
