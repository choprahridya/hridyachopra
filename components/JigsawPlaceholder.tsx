// W=200, H=160, T=28 (tab protrusion), tab half-widths: horizontal=32, vertical=26
// Interlocking layout:
//   P1(tab→right, tab↓)  P2(blank←, tab→, blank↑)  P3(blank←, tab↓)
//   P4(blank↑, blank→)   P5(tab↑, tab→, tab←)       P6(blank↑, blank←)

const PIECES = [
  {
    id: 'p1', tx: 0, ty: 0, fill: '#BFD3EE',
    d: 'M 0,0 L 200,0 L 200,54 C 228,54 228,106 200,106 L 200,160 L 132,160 C 132,188 68,188 68,160 L 0,160 Z',
  },
  {
    id: 'p2', tx: 200, ty: 0, fill: '#B0C8EA',
    d: 'M 0,0 L 200,0 L 200,54 C 228,54 228,106 200,106 L 200,160 L 132,160 C 132,132 68,132 68,160 L 0,160 L 0,106 C 28,106 28,54 0,54 Z',
  },
  {
    id: 'p3', tx: 400, ty: 0, fill: '#CADAF3',
    d: 'M 0,0 L 200,0 L 200,160 L 132,160 C 132,188 68,188 68,160 L 0,160 L 0,106 C 28,106 28,54 0,54 Z',
  },
  {
    id: 'p4', tx: 0, ty: 160, fill: '#A8C0E6',
    d: 'M 0,0 L 68,0 C 68,28 132,28 132,0 L 200,0 L 200,54 C 172,54 172,106 200,106 L 200,160 L 0,160 Z',
  },
  {
    id: 'p5', tx: 200, ty: 160, fill: '#BAD0F0',
    d: 'M 0,0 L 68,0 C 68,-28 132,-28 132,0 L 200,0 L 200,54 C 228,54 228,106 200,106 L 200,160 L 0,160 L 0,106 C -28,106 -28,54 0,54 Z',
  },
  {
    id: 'p6', tx: 400, ty: 160, fill: '#D0E2F8',
    d: 'M 0,0 L 68,0 C 68,28 132,28 132,0 L 200,0 L 200,160 L 0,160 L 0,106 C 28,106 28,54 0,54 Z',
  },
];

export function JigsawPlaceholder() {
  return (
    <svg
      viewBox="-4 -4 608 328"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      style={{ display: 'block' }}
    >
      {/* Top row first so bottom-row tabs paint over top-row fills in blank areas */}
      {PIECES.map(piece => (
        <path
          key={piece.id}
          d={piece.d}
          fill={piece.fill}
          stroke="#EEF3FC"
          strokeWidth="4"
          strokeLinejoin="round"
          transform={`translate(${piece.tx}, ${piece.ty})`}
        />
      ))}

      {/* Image placeholder icons centered in each piece */}
      {PIECES.map(piece => (
        <g
          key={`icon-${piece.id}`}
          transform={`translate(${piece.tx + 100}, ${piece.ty + 80})`}
          opacity="0.28"
        >
          <rect x="-20" y="-15" width="40" height="30" rx="3.5" fill="none" stroke="#4A4540" strokeWidth="1.6" />
          <path d="M-20,15 L-9,2 L-2,9 L6,-1 L20,15 Z" fill="#4A4540" />
          <circle cx="8" cy="-6" r="5" fill="#4A4540" />
        </g>
      ))}
    </svg>
  );
}
