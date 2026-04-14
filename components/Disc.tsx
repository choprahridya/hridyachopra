'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const THEME_DISC_COLORS: Record<string, string[]> = {
  default:  ['#D8E8FA', '#C5D8F4', '#B8CCEE', '#CCE0F8', '#BDD2F2', '#D4E0F0'],
  rose:     ['#F5E0E0', '#EDD0D0', '#E8C8C8', '#F2D8D8', '#E5CCCC', '#EED8D8'],
  sage:     ['#D8EDD8', '#C8E0C8', '#BED8BE', '#CCE5CC', '#C2DCC2', '#D0E8D0'],
  sand:     ['#EDE3D0', '#E5D8C0', '#DCCEB4', '#E8DCC8', '#E0D0BC', '#EAE0CE'],
  lavender: ['#E5D8F8', '#D8C8F4', '#CCBCEE', '#DDD0F5', '#D0C4F0', '#E0D5F8'],
};

function useDiscColors(): string[] {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const update = () => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'default');
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return THEME_DISC_COLORS[theme] ?? THEME_DISC_COLORS.default;
}

export interface Project {
  id: string;
  title: string;
  thumbnail: string;
  color: string;
}

interface DiscProps {
  projects: Project[];
  onActiveProjectChange?: (project: Project) => void;
  size?: number; // diameter in px, default 420
}

export function Disc({ projects, onActiveProjectChange, size = 420 }: DiscProps) {
  const discColors = useDiscColors();
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const router = useRouter();
  const discRef = useRef<HTMLDivElement>(null);
  const lastMouseY = useRef(0);
  const lastTimestamp = useRef(0);
  const animationFrame = useRef<number | undefined>(undefined);
  const dragDistance = useRef(0);

  const r = size / 2;                           // disc radius
  const orbitRadius = r * 0.74;                 // thumbnail orbit
  const thumbSize = Math.round(size * 0.16);    // uniform thumbnail size — no growth on active
  const thumbActive = thumbSize;
  const thumbInactive = thumbSize;

  useEffect(() => {
    const animate = () => {
      if (!isDragging && Math.abs(velocity) > 0.05) {
        setRotation((prev) => prev + velocity);
        // friction proportional to speed: fast spins coast longer, slow spins stop quickly
        setVelocity((prev) => prev * 0.88);
      }
      animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);
    return () => { if (animationFrame.current) cancelAnimationFrame(animationFrame.current); };
  }, [velocity, isDragging]);

  useEffect(() => {
    const anglePerProject = 360 / projects.length;
    let closestIndex = 0;
    let minDiff = 360;
    projects.forEach((_, index) => {
      const thumbnailAngle = ((index * anglePerProject + rotation) % 360 + 360) % 360;
      const diff = Math.min(thumbnailAngle, 360 - thumbnailAngle);
      if (diff < minDiff) { minDiff = diff; closestIndex = index; }
    });
    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
      onActiveProjectChange?.(projects[closestIndex]);
    }
  }, [rotation, projects, activeIndex, onActiveProjectChange]);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.05;
    setRotation((prev) => prev + delta);
    setVelocity((prev) => prev + delta * 0.15);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setHasInteracted(true);
    setIsDragging(true);
    lastMouseY.current = e.clientY;
    lastTimestamp.current = performance.now();
    dragDistance.current = 0;
    setVelocity(0);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(now - lastTimestamp.current, 1);
    const dy = lastMouseY.current - e.clientY;
    // degrees per frame (at 60fps ≈ 16ms), scaled by actual elapsed time
    const delta = (dy / dt) * 16 * 0.2;
    dragDistance.current += Math.abs(dy);
    setRotation((prev) => prev + dy * 0.15);
    setVelocity(delta);
    lastMouseY.current = e.clientY;
    lastTimestamp.current = now;
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setHasInteracted(true);
    setIsDragging(true);
    lastMouseY.current = e.touches[0].clientY;
    lastTimestamp.current = performance.now();
    setVelocity(0);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(now - lastTimestamp.current, 1);
    const dy = lastMouseY.current - e.touches[0].clientY;
    const delta = (dy / dt) * 16 * 0.2;
    setRotation((prev) => prev + dy * 0.15);
    setVelocity(delta);
    lastMouseY.current = e.touches[0].clientY;
    lastTimestamp.current = now;
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
      className="relative select-none"
      style={{ width: size, height: size, cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* SVG disc */}
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ rotate: rotation }}
        className="absolute inset-0 drop-shadow-2xl"
      >
        <defs>
          <radialGradient id="discGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2A2520" />
            <stop offset="60%" stopColor="#1E1B17" />
            <stop offset="100%" stopColor="#141210" />
          </radialGradient>
        </defs>

        {/* Disc body */}
        <circle cx={r} cy={r} r={r} fill="url(#discGradient)" stroke="#0A0908" strokeWidth="1" />

        {/* Grooves */}
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx={r}
            cy={r}
            r={r * 0.9 - i * (r * 0.9 / 30)}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
        ))}

        {/* Center hole */}
        <circle cx={r} cy={r} r={r * 0.075} fill="#0A0908" stroke="#333" strokeWidth="1" />
      </motion.svg>

      {/* Rotate hint — arc curved along disc edge, fades on first drag */}
      {(() => {
        const pad = 28;
        const cx = r + pad;
        const cy = r + pad;
        const arcR = r + 16; // just outside the disc rim
        // ~15° arc on the right side, centred at 0° (clockwise)
        const startAngle = -7.5 * (Math.PI / 180);
        const endAngle   =  7.5 * (Math.PI / 180);
        const x1 = cx + arcR * Math.cos(startAngle);
        const y1 = cy + arcR * Math.sin(startAngle);
        const x2 = cx + arcR * Math.cos(endAngle);
        const y2 = cy + arcR * Math.sin(endAngle);
        // sweep=1 clockwise, large-arc=0 (130° < 180°)
        const d = `M ${x1.toFixed(2)},${y1.toFixed(2)} A ${arcR},${arcR} 0 0,1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
        return (
          <motion.div
            className="absolute pointer-events-none"
            style={{ top: -pad, left: -pad }}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: hasInteracted ? 0 : 0.85 }}
            transition={{ duration: 1.4, delay: hasInteracted ? 0.2 : 0 }}
          >
            <svg width={size + pad * 2} height={size + pad * 2} style={{ display: 'block' }}>
              <defs>
                <marker id="discArrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                  <path d="M 0,0 L 10,5 L 0,10 Z" fill="rgba(120,110,95,0.95)" />
                </marker>
              </defs>
              <path
                d={d}
                fill="none"
                stroke="rgba(140,130,115,0.7)"
                strokeWidth="2"
                strokeLinecap="round"
                markerEnd="url(#discArrow)"
              />
            </svg>
          </motion.div>
        );
      })()}

      {/* Thumbnails */}
      {projects.map((project, index) => {
        const anglePerProject = 360 / projects.length;
        const angle = (index * anglePerProject + rotation) * (Math.PI / 180);
        const x = r + Math.cos(angle) * orbitRadius;
        const y = r + Math.sin(angle) * orbitRadius;
        const isActive = index === activeIndex;

        return (
          <motion.div
            key={project.id}
            className="absolute"
            style={{ left: x, top: y, x: '-50%', y: '-50%', cursor: isActive ? 'pointer' : 'inherit' }}
            animate={{
              width: isActive ? thumbActive : thumbInactive,
              height: isActive ? thumbActive : thumbInactive,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            onClick={() => {
              if (isActive && dragDistance.current < 6) {
                router.push(`/projects/${project.id}`);
              }
            }}
          >
            <motion.div
              className="w-full h-full rounded-2xl overflow-hidden"
              animate={{
                scale: 1,
                opacity: isActive ? 1 : hoveredIndex === index ? 0.85 : 0.55,
              }}
              transition={{ duration: 0.2 }}
              style={{
                outline: isActive
                  ? '2px solid var(--color-accent)'
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: isActive ? '0 4px 20px color-mix(in srgb, var(--color-accent) 30%, transparent)' : 'none',
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center font-sans font-medium"
                style={{
                  backgroundColor: discColors[index] ?? discColors[0],
                  fontSize: project.title.includes("Franklin's") ? Math.max(7, thumbSize * 0.1) : project.title === 'Xchange' ? Math.max(8, thumbSize * 0.12) : project.title === 'Cogniva' ? Math.max(8, thumbSize * 0.12) : Math.max(10, thumbSize * 0.18),
                  color: '#555',
                }}
              >
                {project.title.includes("Franklin's") ? "Franklin's" : project.title === 'Xchange' ? 'Xchange' : project.title === 'Cogniva' ? 'Cogniva' : project.title.slice(0, 2).toUpperCase()}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
