import { useEffect, useRef, useState } from 'react'
import HeartCanvas, { INTRO } from './HeartCanvas'

// Opening animation (design setting variants.intro = 'heart'): on a black/midnight screen the heart
// gathers, beats twice, then bursts; a circle opens from its centre to reveal the page while the points
// fly out over it. ~2.1s. Click or any key skips to the burst. Page animations wait until the reveal
// (html[data-intro="playing"]). Parent decides when to show it (once per visit; never with reduced motion).
export default function HeartIntro({ onDone }) {
  const bg = useRef(null)
  const [burst, setBurst] = useState(false)
  const [skip, setSkip] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.intro = 'playing'
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { delete root.dataset.intro; document.body.style.overflow = prev }
  }, [])

  // Open the hole once the burst starts.
  useEffect(() => {
    if (!burst) return
    delete document.documentElement.dataset.intro
    document.body.style.overflow = ''
    const el = bg.current
    const max = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 160
    const t0 = performance.now()
    const dur = (INTRO.end - INTRO.burst) * 1000 * 0.8
    let raf
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur)
      const r = (1 - Math.pow(1 - t, 3)) * max
      const m = `radial-gradient(circle at 50% 50%, transparent ${r}px, #000 ${r + 140}px)`
      el.style.webkitMaskImage = m
      el.style.maskImage = m
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [burst])

  useEffect(() => {
    const go = () => setSkip(true)
    window.addEventListener('keydown', go)
    return () => window.removeEventListener('keydown', go)
  }, [])

  useEffect(() => {
    if (skip) { setBurst(true); const t = setTimeout(onDone, 700); return () => clearTimeout(t) }
  }, [skip, onDone])

  return (
    <div className={`intro ${burst ? 'is-open' : ''}`} onClick={() => setSkip(true)} aria-hidden="true">
      <div ref={bg} className="intro__bg" />
      {!skip && <HeartCanvas mode="intro" fit={0.74} onBurst={() => setBurst(true)} onDone={onDone} className="intro__heart" />}
      <p className="intro__word">hridya · heart</p>
    </div>
  )
}
