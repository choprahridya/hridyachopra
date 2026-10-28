import { useEffect, useRef } from 'react'
import { getHeart, W, H, CX, CY } from './heartModel'

// Draws the point-cloud heart. mode "intro": points gather, the heart beats twice (lub-dub ×2), then
// bursts outward — onBurst fires at the burst, onDone when the points are gone. mode "idle": a soft
// lub-dub every 1.7s. Points with more depth shift further with the pointer, so it reads as 3D.
// Still frame with reduced motion; idle pauses off-screen and in hidden tabs.
export const INTRO = {
  assemble: 0.38,
  beats: [[0.46, 0.11], [0.62, 0.07], [1.0, 0.12], [1.16, 0.075]],
  burst: 1.38,
  end: 2.1,
}
const IDLE_PERIOD = 1.7
const IDLE_BEATS = [[0, 0.035], [0.17, 0.022]]

const clamp = (v) => Math.max(0, Math.min(1, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
// Sharp rise (40ms), quick decay: one heartbeat sound.
const pulse = (t, at, amp) => {
  const d = t - at
  return d < 0 || d > 0.6 ? 0 : amp * Math.min(1, d / 0.04) * Math.exp(-d * 13)
}

export default function HeartCanvas({ mode = 'idle', fit = 0.92, onBurst, onDone, className = '' }) {
  const ref = useRef(null)
  const cb = useRef({ onBurst, onDone })
  cb.current = { onBurst, onDone }

  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const heart = getHeart()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 }
    let raf = 0, start = performance.now(), visible = true, burstFired = false, done = false

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const r = cv.getBoundingClientRect()
      cv.width = Math.max(1, Math.round(r.width * dpr))
      cv.height = Math.max(1, Math.round(r.height * dpr))
    }

    const draw = (t) => {
      const { buckets, colors, glow, pad } = heart
      let asm = 1, beat = 0, ex = 0
      if (mode === 'intro') {
        asm = easeOut(clamp(t / INTRO.assemble))
        beat = INTRO.beats.reduce((s, [at, amp]) => s + pulse(t, at, amp), 0)
        ex = Math.max(0, t - INTRO.burst)
      } else if (!reduced) {
        const tp = t % IDLE_PERIOD
        beat = IDLE_BEATS.reduce((s, [at, amp]) => s + pulse(tp, at, amp), 0)
      }
      ptr.x += (ptr.tx - ptr.x) * 0.08
      ptr.y += (ptr.ty - ptr.y) * 0.08

      const k = Math.min(cv.width / W, cv.height / H) * fit
      const ox = cv.width / 2 - CX * k
      const oy = cv.height / 2 - CY * k
      const s = 1 + beat
      const fade = 1 - clamp((ex - 0.12) / 0.55)
      const dot = Math.max(1, k * 1.25)

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, cv.width, cv.height)

      // Body glow, swelling with each beat.
      ctx.globalAlpha = Math.min(1, (0.24 + beat * 3) * asm * (1 - clamp(ex / 0.35)))
      if (ctx.globalAlpha > 0) {
        ctx.setTransform(k * s, 0, 0, k * s, ox + CX * k * (1 - s), oy + CY * k * (1 - s))
        ctx.drawImage(glow, -pad, -pad)
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }

      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = Math.min(1, (0.9 + beat * 3) * fade * (0.25 + 0.75 * asm))
      const burstD = ex > 0 ? 1 - Math.exp(-ex * 3.4) : 0
      for (let b = 0; b < buckets.length; b++) {
        ctx.fillStyle = colors[b]
        const pts = buckets[b]
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i]
          let x = p.x + p.sx * (1 - asm)
          let y = p.y + p.sy * (1 - asm)
          const sc = s + p.h * beat * 0.5 // the middle swells more than the rim
          x = CX + (x - CX) * sc + ptr.x * p.h * 16
          y = CY + (y - CY) * sc + ptr.y * p.h * 12
          if (burstD) { const d = p.v * burstD; x += p.dx * d; y += p.dy * d }
          ctx.fillRect(ox + x * k, oy + y * k, dot, dot)
        }
      }

      if (mode === 'intro') {
        if (!burstFired && t >= INTRO.burst) { burstFired = true; cb.current.onBurst?.() }
        if (!done && t >= INTRO.end) { done = true; cb.current.onDone?.() }
      }
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      draw((now - start) / 1000)
    }
    const run = () => {
      cancelAnimationFrame(raf)
      if (mode === 'idle' && (reduced || !visible || document.hidden)) { raf = 0; draw(0.9); return }
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      const r = cv.getBoundingClientRect()
      ptr.tx = clamp((e.clientX - r.left) / r.width) * 2 - 1
      ptr.ty = clamp((e.clientY - r.top) / r.height) * 2 - 1
    }

    size()
    if (mode === 'intro' && reduced) { cb.current.onBurst?.(); cb.current.onDone?.(); return }
    run()
    const ro = new ResizeObserver(() => { size(); if (!raf) draw(0.9) })
    ro.observe(cv)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; run() })
    if (mode === 'idle') io.observe(cv)
    window.addEventListener('pointermove', onMove)
    document.addEventListener('visibilitychange', run)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect(); io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', run)
    }
  }, [mode, fit])

  return <canvas ref={ref} className={`heart-cv ${className}`} aria-hidden="true" />
}
