// Close-up bloom for the dark editorial hero, drawn to read like a lit photograph rather than an icon:
// irregular ruffled petals generated from a seeded profile, midnight-to-pale-blue light along each petal,
// a specular sheen, fine streaked texture (fractal noise), soft-focus back petals and a blurred
// foreground petal. Three stacked layers so the hero can move them at different depths. Original drawing.

// Seeded random so the drawing is identical on every render.
const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

// Petal outline in local space: base at the origin, tip towards -y.
function petalPath({ L, W, bend = 0, ruffle = 0.06, seed = 1 }) {
  const r = rng(seed)
  const waves = [0, 1, 2].map(() => ({ f: 6 + r() * 14, p: r() * Math.PI * 2, a: 0.4 + r() * 0.6 }))
  const N = 30
  const side = (dir) => {
    const pts = []
    for (let i = 0; i <= N; i++) {
      const s = i / N
      let hw = W * Math.pow(Math.sin(Math.PI * Math.min(s, 0.995)), 0.62) * (0.55 + 0.45 * s)
      const wob = waves.reduce((acc, w) => acc + w.a * Math.sin(s * w.f + w.p + (dir > 0 ? 1.7 : 0)), 0) / 2
      hw *= 1 + ruffle * wob * (0.25 + s * s)
      pts.push([dir * hw + bend * L * s * s, -L * s])
    }
    return pts
  }
  const pts = [...side(-1), ...side(1).reverse()]
  // Catmull-Rom through the points → smooth cubic Béziers.
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d + 'Z'
}

const TIPS = ['#B9CEFF', '#8FB0FF', '#A4BEFF', '#7FA2F5']

// Arrangement (degrees from "up"), roughly an orchid seen from slightly above.
const BACK = [
  { a: -58, L: 400, W: 120, bend: 0.08, seed: 11 },
  { a: 96, L: 380, W: 110, bend: -0.1, seed: 12 },
  { a: 178, L: 360, W: 100, bend: 0.12, seed: 13 },
]
const MAIN = [
  { a: -112, L: 390, W: 168, bend: -0.12, ruffle: 0.08, seed: 21 },
  { a: -14, L: 420, W: 178, bend: 0.1, ruffle: 0.07, seed: 22 },
  { a: 58, L: 360, W: 160, bend: 0.14, ruffle: 0.09, seed: 23 },
  { a: 140, L: 400, W: 172, bend: -0.08, ruffle: 0.08, seed: 24 },
  { a: 212, L: 340, W: 150, bend: 0.1, ruffle: 0.1, seed: 25 },
]
const INNER = [
  { a: -40, L: 150, W: 78, bend: 0.2, ruffle: 0.12, seed: 31 },
  { a: 50, L: 140, W: 74, bend: -0.2, ruffle: 0.12, seed: 32 },
  { a: 150, L: 160, W: 90, bend: 0.15, ruffle: 0.14, seed: 33 },
  { a: 240, L: 130, W: 70, bend: -0.15, ruffle: 0.12, seed: 34 },
]

function Petal({ p, i, tex }) {
  const d = petalPath(p)
  const id = `fl-g${p.seed}`
  return (
    <g transform={`rotate(${p.a})`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2={-p.L} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#03050D" />
          <stop offset="0.28" stopColor="#0B1A47" />
          <stop offset="0.65" stopColor="#2450C2" />
          <stop offset="1" stopColor={TIPS[i % TIPS.length]} />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} filter={tex ? 'url(#fl-tex)' : undefined} />
      <path d={d} fill="url(#fl-sheen)" style={{ mixBlendMode: 'screen' }} />
      <path d={d} fill="none" stroke="rgba(190, 212, 255, 0.35)" strokeWidth="1.1" />
    </g>
  )
}

const VIEW = '-520 -520 1040 1040'
// Seen at an angle: tilted and foreshortened.
const ANGLE = 'rotate(-16) scale(1 0.84) skewX(-5)'

export default function Flower({ className = '' }) {
  return (
    <div className={`flower ${className}`} aria-hidden="true">
      <svg className="flower__layer flower__layer--back" viewBox={VIEW} focusable="false">
        <defs>
          <filter id="fl-blur-back"><feGaussianBlur stdDeviation="5" /></filter>
        </defs>
        <g transform={ANGLE} filter="url(#fl-blur-back)" opacity="0.75">
          {BACK.map((p, i) => <Petal key={p.seed} p={p} i={i} />)}
        </g>
      </svg>

      <svg className="flower__layer flower__layer--main" viewBox={VIEW} focusable="false">
        <defs>
          {/* Fine streaks running along each petal, multiplied into its colour */}
          <filter id="fl-tex" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09 0.006" numOctaves="2" seed="7" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.75  0 0 0 0 0.82  0 0 0 0 1  0 0 0 0.55 0" result="streaks" />
            <feComposite in="streaks" in2="SourceGraphic" operator="in" result="s" />
            <feBlend in="s" in2="SourceGraphic" mode="soft-light" />
          </filter>
          <linearGradient id="fl-sheen" x1="0" y1="0" x2="1" y2="0.2">
            <stop offset="0.12" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.38" stopColor="#DCE7FF" stopOpacity="0.26" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="fl-throat" r="0.5">
            <stop offset="0" stopColor="#000" stopOpacity="0.85" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fl-column" r="0.5">
            <stop offset="0" stopColor="#F6F9FF" />
            <stop offset="0.55" stopColor="#B7CBFA" />
            <stop offset="1" stopColor="#3D63C8" />
          </radialGradient>
          <filter id="fl-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000" floodOpacity="0.7" />
          </filter>
        </defs>
        <g transform={ANGLE}>
          <g filter="url(#fl-shadow)">
            {MAIN.map((p, i) => <Petal key={p.seed} p={p} i={i} tex />)}
          </g>
          <ellipse rx="190" ry="170" fill="url(#fl-throat)" />
          <g filter="url(#fl-shadow)">
            {INNER.map((p, i) => <Petal key={p.seed} p={p} i={i + 1} tex />)}
          </g>
          <ellipse cx="6" cy="-10" rx="34" ry="46" fill="url(#fl-column)" />
          <ellipse cx="0" cy="-26" rx="12" ry="10" fill="#F6F9FF" opacity="0.9" />
        </g>
      </svg>

      <svg className="flower__layer flower__layer--front" viewBox={VIEW} focusable="false">
        <defs>
          <filter id="fl-blur-front" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
        </defs>
        {/* Out-of-focus petal crossing the lower edge, like a shallow depth of field */}
        <g transform="translate(-170 470) rotate(-8) scale(1.15 0.8)" filter="url(#fl-blur-front)" opacity="0.9">
          <Petal p={{ a: -62, L: 420, W: 190, bend: 0.1, ruffle: 0.08, seed: 41 }} i={2} />
        </g>
      </svg>
    </div>
  )
}
