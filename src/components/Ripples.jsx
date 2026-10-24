import { useEffect, useRef } from 'react'

// Light ripples that spread from where the visitor clicks or taps the page background and dissolve into it.
// Drawn on a fixed layer behind the content; never triggered by links, controls or the carousel.
const IGNORE = 'a, button, input, textarea, select, label, summary, [role="button"], .c3d__stage, .pcard'
const RINGS = 2
const MAX_ACTIVE = 5

export default function Ripples() {
  const layer = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onDown = (e) => {
      if (reduced.matches || e.button > 0 || !layer.current) return
      if (e.target.closest?.(IGNORE)) return
      const host = layer.current
      while (host.childElementCount >= MAX_ACTIVE * RINGS) host.firstElementChild.remove()
      const add = (cls, delay) => {
        const el = document.createElement('span')
        el.className = cls
        el.style.left = `${e.clientX}px`
        el.style.top = `${e.clientY}px`
        el.style.animationDelay = `${delay}ms`
        el.addEventListener('animationend', () => el.remove())
        host.appendChild(el)
      }
      for (let i = 0; i < RINGS; i++) add('ripple', i * 260)
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])

  return <div ref={layer} className="ripples" aria-hidden="true" />
}
