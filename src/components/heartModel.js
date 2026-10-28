// Point-cloud heart ("Hridya" means heart in Hindi). An original anatomical silhouette — ventricles,
// atria, aortic arch and its branches, pulmonary trunk, vena cava — is painted into an offscreen
// canvas, turned into a soft height map, lit from the upper left and sampled into a few thousand
// points: dense where the surface catches light, sparse in the hollows, brightest along the rim and
// the coronary vessels. Built once and cached. Model space is 400 × 500.
export const W = 400
export const H = 500
export const CX = 215
export const CY = 285

const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const canvas = (w = W, h = H) => {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  return [c, c.getContext('2d', { willReadFrequently: true })]
}

const stroke = (x, w, d) => { x.lineWidth = w; x.stroke(new Path2D(d)) }

function silhouette(x) {
  x.fillStyle = '#fff'; x.strokeStyle = '#fff'; x.lineCap = 'round'; x.lineJoin = 'round'
  // Ventricles, apex towards the lower right.
  x.fill(new Path2D('M108 215 C72 290 108 372 190 430 C236 462 290 482 312 466 C338 440 346 350 326 275 C310 220 262 192 212 190 C165 188 128 196 108 215 Z'))
  // Right atrium (viewer's left) and left auricle (viewer's right).
  x.beginPath(); x.ellipse(122, 240, 56, 74, -0.25, 0, Math.PI * 2); x.fill()
  x.beginPath(); x.ellipse(314, 230, 40, 25, 0.55, 0, Math.PI * 2); x.fill()
  // Superior vena cava.
  stroke(x, 40, 'M150 252 L146 74')
  // Aortic arch and its three branches.
  stroke(x, 48, 'M206 215 C198 150 205 96 246 84 C286 74 312 98 314 142')
  stroke(x, 16, 'M236 88 L231 34')
  stroke(x, 14, 'M260 81 L262 30')
  stroke(x, 14, 'M284 86 L293 40')
  // Pulmonary trunk and right branch.
  stroke(x, 40, 'M250 230 C258 192 276 172 302 162')
  stroke(x, 25, 'M300 162 C326 156 348 160 366 174')
}

const VESSELS = [
  'M262 224 C268 292 280 372 302 456', // anterior interventricular
  'M268 300 C290 310 314 322 332 336',
  'M274 362 C252 372 232 384 214 404',
  'M272 410 C290 414 306 420 318 430',
  'M182 232 C152 272 140 322 160 372', // right coronary
  'M160 372 C176 400 196 418 222 432',
  'M262 224 C290 227 318 242 332 262', // circumflex
  'M226 300 C214 330 206 356 204 384',
]
const GROOVES = ['M262 224 C268 292 280 372 302 456', 'M176 214 C150 236 134 262 128 300', 'M214 206 C236 200 262 204 290 218']

let cache = null

export function getHeart() {
  if (cache) return cache
  const r = rng(20261028)

  const [mc, mx] = canvas(); silhouette(mx)
  const mask = mx.getImageData(0, 0, W, H).data

  // Soft dome over the silhouette: its slope gives a surface normal for lighting.
  const [hc, hx] = canvas(); hx.filter = 'blur(16px)'; hx.drawImage(mc, 0, 0)
  const height = hx.getImageData(0, 0, W, H).data

  // Coronary vessels (bright) and the grooves they run in (dark).
  const [vc, vx] = canvas(); vx.strokeStyle = '#fff'; vx.lineCap = 'round'; vx.filter = 'blur(1.2px)'
  VESSELS.forEach((d, i) => stroke(vx, i % 2 ? 2.2 : 3.2, d))
  const vessels = vx.getImageData(0, 0, W, H).data
  const [gc, gx] = canvas(); gx.strokeStyle = '#fff'; gx.lineCap = 'round'; gx.filter = 'blur(7px)'
  GROOVES.forEach((d) => stroke(gx, 16, d))
  const grooves = gx.getImageData(0, 0, W, H).data

  const a = (data, x, y) => data[((Math.max(0, Math.min(H - 1, y | 0)) * W) + Math.max(0, Math.min(W - 1, x | 0))) * 4 + 3] / 255
  const L = [-0.55, -0.68, 0.48] // light from the upper left, slightly in front

  const points = []
  for (let n = 0; n < 160000 && points.length < 15000; n++) {
    const x = r() * W, y = r() * H
    if (a(mask, x, y) < 0.5) continue
    const h = a(height, x, y)
    const gxs = (a(height, x + 3, y) - a(height, x - 3, y)) * 9
    const gys = (a(height, x, y + 3) - a(height, x, y - 3)) * 9
    const len = Math.hypot(gxs, gys, 1)
    const lambert = Math.max(0, (-gxs * L[0] - gys * L[1] + L[2]) / len)
    const rim = Math.max(0, 1 - h / 0.42) // glowing edge
    const mottle = 0.5 + 0.5 * Math.sin(x * 0.045 + Math.sin(y * 0.031) * 2.4) * Math.sin(y * 0.052 + x * 0.013)
    let b = 0.22 + lambert * 0.7 + rim * 0.6 + a(vessels, x, y) * 0.7 - a(grooves, x, y) * 0.45 + (mottle - 0.5) * 0.22
    b = Math.max(0.04, Math.min(1, b))
    if (r() > b * 0.9 + 0.06) continue
    const ang = Math.atan2(y - CY, x - CX) + (r() - 0.5) * 0.9
    points.push({
      x, y, h, b,
      sx: (r() - 0.5) * 520, sy: (r() - 0.5) * 620, // scattered start for the assemble
      dx: Math.cos(ang), dy: Math.sin(ang), v: 140 + r() * 560, // burst
    })
  }

  // Ten brightness buckets so drawing switches fill colour only ten times a frame.
  const buckets = Array.from({ length: 10 }, () => [])
  points.forEach((p) => buckets[Math.min(9, Math.floor(p.b * 10))].push(p))
  const colors = buckets.map((_, i) => {
    const t = (i + 0.5) / 10
    const c = [52 + (222 - 52) * t, 104 + (236 - 104) * t, 236 + (255 - 236) * t].map(Math.round)
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${(0.4 + t * 0.6).toFixed(2)})`
  })

  // Soft blue body glow behind the points (the watercolour depth).
  const PAD = 80
  const [glow, glx] = canvas(W + PAD * 2, H + PAD * 2)
  glx.filter = 'blur(20px)'; glx.drawImage(mc, PAD, PAD); glx.filter = 'none'
  glx.globalCompositeOperation = 'source-in'; glx.fillStyle = 'rgb(44, 96, 232)'; glx.fillRect(0, 0, W + PAD * 2, H + PAD * 2)

  cache = { buckets, colors, glow, pad: PAD }
  return cache
}
