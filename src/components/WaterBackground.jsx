import { useEffect, useRef } from 'react'

// Water surface: soft moving caustic light over a faint blue swell.
// Fills the whole page, or with `contained` only its parent section (fading out at the bottom).
// Drawn on a small canvas (1/6 of the screen) and scaled up smoothly, so it stays cheap.
// Runs at ~30fps, pauses when the tab is hidden; reduced motion shows a still frame.
const SCALE = 6
const FPS = 30

const hexToRgb = (hex) => {
  const h = hex.trim().replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) || 0)
}

export default function WaterBackground({ contained = false }) {
  const canvas = useRef(null)

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let img, w, h, raf = 0, last = 0
    const start = performance.now()

    const box = () => (contained ? cv.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight })
    const size = () => {
      const b = box()
      w = Math.max(16, Math.ceil(b.width / SCALE))
      h = Math.max(16, Math.ceil(b.height / SCALE))
      cv.width = w
      cv.height = h
      img = ctx.createImageData(w, h)
    }

    const draw = (t) => {
      const [ar, ag, ab] = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--c-accent') || '#17459F')
      const d = img.data
      const aspect = w / h
      for (let y = 0; y < h; y++) {
        const ny = y / h
        for (let x = 0; x < w; x++) {
          const nx = (x / w) * aspect
          // Interfering waves give the water's slow swell.
          const v =
            Math.sin(nx * 6.0 + t * 0.35) +
            Math.sin((nx * 0.7 + ny) * 7.5 - t * 0.45) +
            Math.sin((ny * 1.4 - nx * 0.5) * 5.5 + t * 0.3) +
            Math.sin(Math.hypot(nx - 0.6 * aspect - Math.sin(t * 0.05) * 0.3, ny - 0.4) * 9 - t * 0.5)
          const swell = (v + 4) / 8 // 0..1
          // Bright thin bands where waves meet: the caustic light.
          const caustic = Math.pow(1 - Math.abs(Math.sin(v * 1.35)), 7)
          const a1 = 0.035 + swell * 0.07 // blue tint in the troughs
          const a2 = caustic * 0.55 // white light
          const a = a2 + a1 * (1 - a2)
          const i = (y * w + x) * 4
          d[i] = (255 * a2 + ar * a1 * (1 - a2)) / a
          d[i + 1] = (255 * a2 + ag * a1 * (1 - a2)) / a
          d[i + 2] = (255 * a2 + ab * a1 * (1 - a2)) / a
          d[i + 3] = a * 255
        }
      }
      ctx.putImageData(img, 0, 0)
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (now - last < 1000 / FPS) return
      last = now
      draw((now - start) / 1000)
    }

    const run = () => {
      cancelAnimationFrame(raf)
      if (reduced.matches || document.hidden) draw(8)
      else raf = requestAnimationFrame(loop)
    }

    size()
    run()
    const onResize = () => { size(); if (reduced.matches) draw(8) }
    window.addEventListener('resize', onResize)
    const ro = contained ? new ResizeObserver(onResize) : null
    ro?.observe(cv.parentElement)
    document.addEventListener('visibilitychange', run)
    reduced.addEventListener('change', run)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
      document.removeEventListener('visibilitychange', run)
      reduced.removeEventListener('change', run)
    }
  }, [contained])

  return <canvas ref={canvas} className={`water-bg ${contained ? 'water-bg--contained' : ''}`} aria-hidden="true" />
}
