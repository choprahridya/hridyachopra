// Cyanotype print for the landing hero, after the owner's own sun prints. <CyanoPaper/> draws the
// Prussian-blue paper (uneven coating, brush marks, grain); <CyanoBloom/> lays the owner's real print
// exposure on the right; <CyanoEdge/> is the torn (deckled) bottom edge. Drawn parts use a seeded random
// source so they are identical on every render.

const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export function CyanoPaper() {
  return (
    <svg className="cyano__paper" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        {/* Cloudy, uneven coating: lighter patches where the sensitiser was thin */}
        <filter id="cy-cloud" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0035 0.006" numOctaves="4" seed="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.82  0 0 0 0 0.88  0 0 0 0 1  0 0 0 -2.2 1.25" />
        </filter>
        {/* Darker blotches where it pooled */}
        <filter id="cy-pool" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="17" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.11  0 0 0 0 0.3  1.8 0 0 0 -0.75" />
        </filter>
        {/* Faint brush marks along the coating direction */}
        <filter id="cy-brush" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0008 0.03" numOctaves="2" seed="8" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.91  0 0 0 0 1  0 0 0 -2 1.05" />
        </filter>
        {/* Paper grain */}
        <filter id="cy-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.94  0 0 0 0 1  0 0 0 -2.4 1.3" />
        </filter>
        <radialGradient id="cy-vignette" cx="0.55" cy="0.45" r="0.75">
          <stop offset="0.45" stopColor="#0E2350" stopOpacity="0" />
          <stop offset="1" stopColor="#0E2350" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id="cy-base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#31538F" />
          <stop offset="0.55" stopColor="#274783" />
          <stop offset="1" stopColor="#1E3A74" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#cy-base)" />
      <rect width="1600" height="1000" filter="url(#cy-cloud)" opacity="0.32" />
      <rect width="1600" height="1000" filter="url(#cy-pool)" opacity="0.5" />
      <rect width="1600" height="1000" filter="url(#cy-brush)" opacity="0.16" />
      <rect width="1600" height="1000" fill="url(#cy-vignette)" />
      <rect width="1600" height="1000" filter="url(#cy-grain)" opacity="0.16" />
    </svg>
  )
}

// The flowers are the owner's own cyanotype: the white exposure lifted out of a photo of the print
// (authoring/media-src/cyanotype/, turned upright so the stems run down) as a transparent layer, laid on
// the drawn paper. It sways gently from the stems' base.
export function CyanoBloom() {
  return (
    <div className="cyano__bloom" aria-hidden="true">
      <img className="cyano__print" src="/media/cyano-flowers.webp" alt="" decoding="async" fetchpriority="high" />
    </div>
  )
}

// Torn bottom edge: an irregular line with a thin white fibre along it; below it is the page.
export function CyanoEdge() {
  const r = rng(77)
  const pts = []
  for (let x = 0; x <= 1600; x += 5 + r() * 9) pts.push([x, 10 + r() * 9 + Math.sin(x * 0.011) * 4 + (r() < 0.08 ? r() * 8 : 0)])
  pts.push([1600, 14])
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return (
    <svg className="cyano__edge" viewBox="0 0 1600 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id="cy-fibre" x="0" y="-50%" width="100%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.4 0.9" numOctaves="2" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </defs>
      <path d={`${line} L1600 40 L0 40 Z`} fill="var(--c-bg)" />
      <path d={line} fill="none" stroke="rgba(244, 247, 252, 0.75)" strokeWidth="2.2" filter="url(#cy-fibre)" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
