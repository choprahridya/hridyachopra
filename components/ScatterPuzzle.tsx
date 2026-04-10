'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

// Piece center = scatter.x (since marginLeft=-W/2 cancels out)
// Columns: -185, 0, +185  → 65px gaps between 120px-wide pieces
// Rows:    -260, -135      → 29px gap between rows, anchor at 90% of 400px container
const PIECES = [
  { id: 1, fill: '#BFD3EE', path: 'M 0,0 L 150,0 L 150,41 C 171,41 171,79 150,79 L 150,120 L 99,120 C 99,141 51,141 51,120 L 0,120 Z',                       scatter: { x: -185, y: -260, rotate: -12 }, photoSrc: '/hridya5.jpg', photoY: -30 },
  { id: 2, fill: '#CADAF3', path: 'M 0,0 L 150,0 L 150,41 C 171,41 171,79 150,79 L 150,120 L 99,120 C 99,99 51,99 51,120 L 0,120 L 0,79 C 21,79 21,41 0,41 Z', scatter: { x:    0,  y: -260, rotate:   3 }, photoSrc: '/hridya.jpg', photoY: -30 },
  { id: 3, fill: '#A8C0E6', path: 'M 0,0 L 150,0 L 150,120 L 99,120 C 99,141 51,141 51,120 L 0,120 L 0,79 C 21,79 21,41 0,41 Z',                              scatter: { x:  185, y: -260, rotate:  12 }, photoSrc: '/hridya3.jpg', photoY: -5 },
  { id: 4, fill: '#D0E2F8', path: 'M 0,0 L 51,0 C 51,21 99,21 99,0 L 150,0 L 150,41 C 129,41 129,79 150,79 L 150,120 L 0,120 Z',                              scatter: { x: -185, y: -135, rotate: -18 }, photoSrc: '/hridya4.jpg', photoY: -30 },
  { id: 5, fill: '#BAD0F0', path: 'M 0,0 L 51,0 C 51,-21 99,-21 99,0 L 150,0 L 150,41 C 171,41 171,79 150,79 L 150,120 L 0,120 L 0,79 C -21,79 -21,41 0,41 Z', scatter: { x:    0,  y: -135, rotate:   6 }, photoSrc: '/hridya2.jpg', photoY: -60 },
  { id: 6, fill: '#B0C8EA', path: 'M 0,0 L 51,0 C 51,21 99,21 99,0 L 150,0 L 150,120 L 0,120 L 0,79 C 21,79 21,41 0,41 Z',                                    scatter: { x:  185, y: -135, rotate:  15 }, photoSrc: '/hridya6.jpg', photoY: 0 },
] as const;

const W = 120;
const H = 96;

export function ScatterPuzzle() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const handler = () => {
      setResetting(true);
      setTimeout(() => setResetting(false), 400);
    };
    window.addEventListener('puzzleReset', handler);
    return () => window.removeEventListener('puzzleReset', handler);
  }, []);

  const scattered = inView && !resetting;

  return (
    <div ref={ref} className="relative w-full" style={{ height: '400px' }}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '90%',
          width: 0,
          height: 0,
        }}
      >
        {PIECES.map((piece, i) => {
          const hasPhoto = 'photoSrc' in piece;
          return (
            <motion.div
              key={piece.id}
              className="absolute cursor-default"
              style={{ marginLeft: -W / 2, marginTop: -H / 2 }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
              animate={
                scattered
                  ? { x: piece.scatter.x, y: piece.scatter.y, rotate: piece.scatter.rotate, scale: 1, opacity: 1 }
                  : { x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }
              }
              whileHover={scattered ? { scale: 1.12 } : {}}
              transition={{ type: 'spring', stiffness: 95, damping: 16, delay: scattered ? i * 0.065 : 0 }}
            >
              <svg width={W} height={H} viewBox="0 0 150 120" overflow="visible" style={{ display: 'block' }}>
                {hasPhoto && (
                  <defs>
                    <clipPath id={`clip-${piece.id}`}>
                      <path d={piece.path} />
                    </clipPath>
                  </defs>
                )}

                {/* Base color fill */}
                <path
                  d={piece.path}
                  fill={piece.fill}
                  stroke={hasPhoto ? 'none' : '#EEF3FC'}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Photo layer — always visible */}
                {hasPhoto && (
                  <image
                    href={(piece as typeof piece & { photoSrc: string; photoY: number }).photoSrc}
                    x="-30"
                    y={(piece as typeof piece & { photoY: number }).photoY}
                    width="210" height="180"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#clip-${piece.id})`}
                  />
                )}
              </svg>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
