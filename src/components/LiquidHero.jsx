import { useEffect, useRef } from 'react'

// Landing-hero background: a generative "liquid" field in blues (domain-warped noise, slowly flowing) with
// a ring that follows the pointer. Like oil and water, the ring shoves the liquid out of its way and drags
// it along; the push is kept in a low-resolution displacement buffer that flows with itself and slowly
// relaxes, so the colours smear and then settle back. Inside the ring the field is magnified like a lens.
// Effect idea from an owner-supplied reference (an agency site with an interactive generative background);
// original shaders, colours from this site's blues. Without half-float render targets the push is not
// kept (the field still bends under the ring); without WebGL the hero keeps its dark background.
// Paused off-screen and in hidden tabs.
const SIM = 192 // displacement buffer height (width follows the aspect ratio)

const VS = 'attribute vec2 a; void main () { gl_Position = vec4(a, 0.0, 1.0); }'

// Displacement buffer: self-advect (so pushes flow), relax, add this frame's push (drag + repel).
const SIM_FS = `
precision highp float;
uniform sampler2D uPrev; uniform vec2 uSimRes; uniform float uAr; uniform vec2 uMouse; uniform vec2 uVel; uniform float uRing;
void main () {
  vec2 uv = gl_FragCoord.xy / uSimRes;
  vec2 here = texture2D(uPrev, uv).xy;
  vec2 prev = texture2D(uPrev, uv - vec2(here.x / uAr, here.y) * 0.035).xy * 0.972;
  vec2 p = vec2(uv.x * uAr, uv.y), m = vec2(uMouse.x * uAr, uMouse.y);
  vec2 dv = p - m; float d = length(dv);
  float fall = exp(-d * d / 0.018);
  float speed = length(uVel);
  vec2 push = uVel * fall * 0.09 + (dv / (d + 0.0001)) * fall * speed * 0.05;
  vec2 next = prev + push * uRing;
  float L = length(next); if (L > 0.35) next *= 0.35 / L;
  gl_FragColor = vec4(next, 0.0, 1.0);
}`

const FS = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform vec2 uVel; uniform float uRing;
uniform vec3 uBg; uniform sampler2D uDisp; uniform float uHasDisp;

float hash (vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise (vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
// two octaves only: big, soft shapes with no fine detail
float fbm (vec2 p) { return 0.67 * noise(p) + 0.33 * noise(p * 2.03 + 17.0); }

void main () {
  vec2 uv = gl_FragCoord.xy / uRes;
  float ar = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * ar, uv.y);
  vec2 m = vec2(uMouse.x * ar, uMouse.y);
  float d = distance(p, m);
  float R = 0.075; // ring radius (fraction of the hero height)

  // the liquid has been pushed around (kept in the buffer); without it, bend only under the ring
  if (uHasDisp > 0.5) p -= texture2D(uDisp, uv).xy;
  else p -= uVel * exp(-d * d / (R * R * 3.0)) * 0.9 * uRing;
  float lens = smoothstep(R, 0.0, d) * uRing;
  p = m + (p - m) * (1.0 - 0.18 * lens);

  // slow, large, smoothly folding shapes that keep flowing on their own
  float t = uTime * 0.055;
  vec2 q = vec2(fbm(p * 0.9 + vec2(t, -t * 0.6)), fbm(p * 0.9 + vec2(3.1, 7.4) - vec2(t * 0.8, -t * 0.4)));
  float f = fbm(p * 0.75 + 1.9 * q + vec2(t * 0.35, -t * 0.25));

  // black, then a glowing electric-blue body with a pale fringe at its edge (like light through oil)
  // mostly black; bands start in deep indigo (#090554), glow electric blue at the core, pale at the fringe
  vec3 c = vec3(0.004, 0.005, 0.016);
  float band = smoothstep(0.46, 0.62, f);
  float fringe = smoothstep(0.40, 0.50, f) * (1.0 - smoothstep(0.50, 0.62, f));
  c = mix(c, vec3(0.035, 0.020, 0.330), band);
  c += vec3(0.50, 0.70, 1.00) * fringe * 0.4;
  c = mix(c, vec3(0.09, 0.28, 0.85), smoothstep(0.58, 0.76, f) * 0.85);
  c = mix(c, vec3(0.55, 0.72, 0.98), smoothstep(0.72, 0.90, f) * 0.5);

  // the ring: a dark lens with a faint lit rim
  float dr = abs(distance(vec2(uv.x * ar, uv.y), m) - R);
  c *= 1.0 - smoothstep(0.012, 0.0, dr) * 0.7 * uRing;
  c += vec3(0.6, 0.72, 1.0) * smoothstep(0.0022, 0.0, abs(dr - 0.006)) * 0.25 * uRing;

  c += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.025; // film grain
  c = mix(c, uBg, smoothstep(0.16, 0.0, uv.y));       // fade into the page below
  gl_FragColor = vec4(c, 1.0);
}`

export default function LiquidHero() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const g = canvas.getContext('webgl', { antialias: false, depth: false, stencil: false, premultipliedAlpha: false })
    if (!g) return
    const sh = (type, src) => { const s = g.createShader(type); g.shaderSource(s, src); g.compileShader(s); return s }
    const vs = sh(g.VERTEX_SHADER, VS)
    const program = (src) => {
      const p = g.createProgram()
      g.attachShader(p, vs); g.attachShader(p, sh(g.FRAGMENT_SHADER, src)); g.bindAttribLocation(p, 0, 'a'); g.linkProgram(p)
      return g.getProgramParameter(p, g.LINK_STATUS) ? p : null
    }
    const draw = program(FS)
    if (!draw) return
    const sim = program(SIM_FS)
    const U = (p, n) => g.getUniformLocation(p, n)
    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer())
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW)
    g.enableVertexAttribArray(0); g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0)

    const hex = (getComputedStyle(document.documentElement).getPropertyValue('--c-bg').trim() || '#13285A').replace('#', '')
    g.useProgram(draw)
    g.uniform3f(U(draw, 'uBg'), ...[0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255))

    // Displacement buffer (ping-pong) — needs half-float render targets with linear filtering.
    const half = g.getExtension('OES_texture_half_float')
    const lin = g.getExtension('OES_texture_half_float_linear')
    let disp = null
    const target = (w, h) => {
      const tex = g.createTexture()
      g.bindTexture(g.TEXTURE_2D, tex)
      for (const [k, v] of [[g.TEXTURE_MIN_FILTER, g.LINEAR], [g.TEXTURE_MAG_FILTER, g.LINEAR], [g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE], [g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE]]) g.texParameteri(g.TEXTURE_2D, k, v)
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, w, h, 0, g.RGBA, half.HALF_FLOAT_OES, null)
      const fb = g.createFramebuffer()
      g.bindFramebuffer(g.FRAMEBUFFER, fb); g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0)
      const ok = g.checkFramebufferStatus(g.FRAMEBUFFER) === g.FRAMEBUFFER_COMPLETE
      g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT)
      g.bindFramebuffer(g.FRAMEBUFFER, null)
      return ok ? { tex, fb } : null
    }
    const makeDisp = () => {
      if (!sim || !half || !lin) return null
      const h = SIM, w = Math.max(1, Math.round(SIM * canvas.width / Math.max(1, canvas.height)))
      const a = target(w, h), b = target(w, h)
      return a && b ? { a, b, w, h } : null
    }

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      canvas.width = Math.round(canvas.clientWidth * dpr); canvas.height = Math.round(canvas.clientHeight * dpr)
      disp = makeDisp()
    }
    size()

    const ptr = { x: 0.7, y: 0.5, sx: 0.7, sy: 0.5, vx: 0, vy: 0, on: 0, ring: 0 }
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      const inside = e.clientY >= r.top && e.clientY <= r.bottom && e.clientX >= r.left && e.clientX <= r.right
      ptr.on = inside ? 1 : 0
      if (!inside) return
      ptr.x = (e.clientX - r.left) / r.width; ptr.y = 1 - (e.clientY - r.top) / r.height
    }
    const onLeave = () => { ptr.on = 0 }

    let raf = 0, visible = true
    const start = performance.now()
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const px = ptr.sx, py = ptr.sy
      ptr.sx += (ptr.x - ptr.sx) * 0.14; ptr.sy += (ptr.y - ptr.sy) * 0.14
      const ar = canvas.width / canvas.height
      ptr.vx += ((ptr.sx - px) * ar * 9 - ptr.vx) * 0.2; ptr.vy += ((ptr.sy - py) * 9 - ptr.vy) * 0.2
      ptr.ring += (ptr.on - ptr.ring) * 0.08

      if (disp) {
        g.useProgram(sim)
        g.bindFramebuffer(g.FRAMEBUFFER, disp.b.fb); g.viewport(0, 0, disp.w, disp.h)
        g.activeTexture(g.TEXTURE0); g.bindTexture(g.TEXTURE_2D, disp.a.tex); g.uniform1i(U(sim, 'uPrev'), 0)
        g.uniform2f(U(sim, 'uSimRes'), disp.w, disp.h); g.uniform1f(U(sim, 'uAr'), ar)
        g.uniform2f(U(sim, 'uMouse'), ptr.sx, ptr.sy); g.uniform2f(U(sim, 'uVel'), ptr.vx, ptr.vy); g.uniform1f(U(sim, 'uRing'), ptr.ring)
        g.drawArrays(g.TRIANGLES, 0, 3)
        ;[disp.a, disp.b] = [disp.b, disp.a]
      }

      g.useProgram(draw)
      g.bindFramebuffer(g.FRAMEBUFFER, null); g.viewport(0, 0, canvas.width, canvas.height)
      g.uniform2f(U(draw, 'uRes'), canvas.width, canvas.height)
      g.uniform1f(U(draw, 'uTime'), (now - start) / 1000)
      g.uniform2f(U(draw, 'uMouse'), ptr.sx, ptr.sy)
      g.uniform2f(U(draw, 'uVel'), ptr.vx, ptr.vy)
      g.uniform1f(U(draw, 'uRing'), ptr.ring)
      g.uniform1f(U(draw, 'uHasDisp'), disp ? 1 : 0)
      if (disp) { g.activeTexture(g.TEXTURE0); g.bindTexture(g.TEXTURE_2D, disp.a.tex); g.uniform1i(U(draw, 'uDisp'), 0) }
      g.drawArrays(g.TRIANGLES, 0, 3)
    }
    const run = () => { cancelAnimationFrame(raf); if (visible && !document.hidden) raf = requestAnimationFrame(frame) }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; run() }); io.observe(canvas)
    const ro = new ResizeObserver(size); ro.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', run)
    run()
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      window.removeEventListener('pointermove', onMove); document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', run)
    }
  }, [])

  return <canvas ref={ref} className="liquid-hero" aria-hidden="true" />
}
