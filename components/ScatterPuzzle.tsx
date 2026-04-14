'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

// Assembled: pieces form a 3×2 grid (120×96 px each at 0.8 scale).
// Anchor is left:50%, top:90% of the 400px container.
// Grid centers relative to anchor: cols -120/0/+120, rows -208/-112.
// Scatter: pieces start spread out; on page load they fly together.
const PIECES = [
  {
    id: 1, fill: '#BFD3EE',
    path: 'M 0,0 L 150,0 L 150,41 C 171,41 171,79 150,79 L 150,120 L 99,120 C 99,141 51,141 51,120 L 0,120 Z',
    scatter:  { x: -230, y: -315, rotate: -32 },
    assembled: { x: -120, y: -208 },
    photoSrc: '/hridya5.jpg', photoY: -30,
  },
  {
    id: 2, fill: '#CADAF3',
    path: 'M 0,0 L 150,0 L 150,41 C 171,41 171,79 150,79 L 150,120 L 99,120 C 99,99 51,99 51,120 L 0,120 L 0,79 C 21,79 21,41 0,41 Z',
    scatter:  { x:  65,  y: -350, rotate:  22 },
    assembled: { x:   0, y: -208 },
    photoSrc: '/hridya.jpg', photoY: -30,
  },
  {
    id: 3, fill: '#A8C0E6',
    path: 'M 0,0 L 150,0 L 150,120 L 99,120 C 99,141 51,141 51,120 L 0,120 L 0,79 C 21,79 21,41 0,41 Z',
    scatter:  { x:  258, y: -290, rotate:  27 },
    assembled: { x:  120, y: -208 },
    photoSrc: '/hridya3.jpg', photoY: -5,
  },
  {
    id: 4, fill: '#D0E2F8',
    path: 'M 0,0 L 51,0 C 51,21 99,21 99,0 L 150,0 L 150,41 C 129,41 129,79 150,79 L 150,120 L 0,120 Z',
    scatter:  { x: -248, y:  -68, rotate: -38 },
    assembled: { x: -120, y: -112 },
    photoSrc: '/hridya4.jpg', photoY: -30,
  },
  {
    id: 5, fill: '#BAD0F0',
    path: 'M 0,0 L 51,0 C 51,-21 99,-21 99,0 L 150,0 L 150,41 C 171,41 171,79 150,79 L 150,120 L 0,120 L 0,79 C -21,79 -21,41 0,41 Z',
    scatter:  { x:  -42, y:  -42, rotate: -16 },
    assembled: { x:    0, y: -112 },
    photoSrc: '/hridya2.jpg', photoY: -60,
  },
  {
    id: 6, fill: '#B0C8EA',
    path: 'M 0,0 L 51,0 C 51,21 99,21 99,0 L 150,0 L 150,120 L 0,120 L 0,79 C 21,79 21,41 0,41 Z',
    scatter:  { x:  242, y:  -78, rotate:  34 },
    assembled: { x:  120, y: -112 },
    photoSrc: '/hridya6.jpg', photoY: 0,
  },
] as const;

const W = 120;
const H = 96;

export function ScatterPuzzle() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const handler = () => {
      setResetting(true);
      setTimeout(() => setResetting(false), 600);
    };
    window.addEventListener('puzzleReset', handler);
    return () => window.removeEventListener('puzzleReset', handler);
  }, []);

  const assembled = inView && !resetting;

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
              initial={{
                x: piece.scatter.x,
                y: piece.scatter.y,
                rotate: piece.scatter.rotate,
                opacity: 0,
                scale: 0.85,
              }}
              animate={
                assembled
                  ? {
                      x: piece.assembled.x,
                      y: piece.assembled.y,
                      rotate: 0,
                      opacity: 1,
                      scale: 1,
                    }
                  : {
                      x: piece.scatter.x,
                      y: piece.scatter.y,
                      rotate: piece.scatter.rotate,
                      opacity: 0,
                      scale: 0.85,
                    }
              }
              whileHover={assembled ? { scale: 1.08 } : {}}
              transition={{
                type: 'spring',
                stiffness: 65,
                damping: 16,
                delay: assembled ? i * 0.08 : i * 0.04,
              }}
            >
              <svg width={W} height={H} viewBox="0 0 150 120" overflow="visible" style={{ display: 'block' }}>
                {hasPhoto && (
                  <defs>
                    <clipPath id={`clip-${piece.id}`}>
                      <path d={piece.path} />
                    </clipPath>
                  </defs>
                )}

                <path d={piece.path} fill={piece.fill} stroke="none" />

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
