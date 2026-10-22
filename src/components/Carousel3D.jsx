import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MediaSlot } from './bits'

// Infinite 3D card carousel (original implementation, inspired by an infinite 3D
// carousel seen on Framer). Five card slots are recycled around a continuous
// position; drag, arrow keys, buttons and slow autoplay all move that position.
const SLOTS = [-2, -1, 0, 1, 2]
const AUTOPLAY_ITEMS_PER_SEC = 0.11
const FRICTION_PER_FRAME = 0.93
const EASE_RATE = 9 // how quickly the drawn position catches up (per second)

const wrap = (i, n) => ((i % n) + n) % n

export default function Carousel3D({ items, label = 'Selected projects', autoplay = true, variant }) {
  const n = items.length
  const root = useRef(null)
  const cards = useRef([])
  const target = useRef(0) // where we're heading, in item units
  const drawn = useRef(0) // what's on screen
  const velocity = useRef(0) // from drag release, items/sec
  const drag = useRef(null)
  const raf = useRef(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [base, setBase] = useState(0) // nearest whole position; slot 0 shows this card
  const [announce, setAnnounce] = useState('')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  const playing = autoplay && n > 1 && !paused && !hovered && !focused && inView && !reduced

  const paint = useCallback(() => {
    const pos = drawn.current
    const nearest = Math.round(pos)
    SLOTS.forEach((slot, s) => {
      const el = cards.current[s]
      if (!el) return
      const d = nearest + slot - pos // distance from centre, in items
      const a = Math.min(Math.abs(d), 2.4)
      const side = Math.sign(d)
      el.style.setProperty('--d', d.toFixed(4))
      el.style.setProperty('--a', a.toFixed(4))
      el.style.setProperty('--side', side)
      el.style.zIndex = String(100 - Math.round(a * 10))
      el.style.opacity = String(Math.max(0, Math.min(1, (2.5 - Math.abs(d)) / 0.9)))
    })
    setBase((prev) => (prev === nearest ? prev : nearest))
  }, [])

  // Animation loop: runs only while something is moving.
  const tick = useCallback(() => {
    let last = performance.now()
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!drag.current) {
        if (playing) target.current += AUTOPLAY_ITEMS_PER_SEC * dt
        if (Math.abs(velocity.current) > 0.01) {
          target.current += velocity.current * dt
          velocity.current *= Math.pow(FRICTION_PER_FRAME, dt * 60)
        } else if (velocity.current !== 0) {
          velocity.current = 0
          if (!playing) target.current = Math.round(target.current) // settle on a card
        }
      }
      const k = reduced ? 1 : 1 - Math.exp(-EASE_RATE * dt)
      drawn.current += (target.current - drawn.current) * k
      paint()
      const moving = playing || drag.current || Math.abs(velocity.current) > 0.01 || Math.abs(target.current - drawn.current) > 0.0005
      raf.current = moving ? requestAnimationFrame(frame) : 0
    }
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(frame)
  }, [playing, reduced, paint])

  useEffect(() => {
    paint()
    tick()
    return () => cancelAnimationFrame(raf.current)
  }, [tick, paint])

  // When autoplay stops (hover, focus, pause), come to rest on the nearest card.
  useEffect(() => {
    if (!playing && !drag.current) {
      target.current = Math.round(target.current)
      tick()
    }
  }, [playing, tick])

  const go = (delta) => {
    velocity.current = 0
    target.current = Math.round(target.current) + delta
    const next = items[wrap(Math.round(target.current), n)]
    setAnnounce(`${wrap(Math.round(target.current), n) + 1} of ${n}: ${next.title}`)
    tick()
  }

  const stepPx = () => root.current?.querySelector('.c3d__card')?.offsetWidth * 0.62 || 300

  const onPointerDown = (e) => {
    if (e.button !== 0 || n < 2) return
    drag.current = { x: e.clientX, t: e.timeStamp, moved: false, v: 0, id: e.pointerId }
    velocity.current = 0
    tick()
  }
  const onPointerMove = (e) => {
    const g = drag.current
    if (!g || g.id !== e.pointerId) return
    const dx = e.clientX - g.x
    if (!g.moved && Math.abs(dx) > 5) {
      g.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    if (!g.moved) return
    const dt = Math.max(0.001, (e.timeStamp - g.t) / 1000)
    const di = -dx / stepPx()
    target.current += di
    drawn.current += di // follow the finger directly
    g.v = g.v * 0.6 + (di / dt) * 0.4
    g.x = e.clientX
    g.t = e.timeStamp
  }
  const endDrag = (e) => {
    const g = drag.current
    if (!g || g.id !== e.pointerId) return
    drag.current = null
    if (g.moved) {
      velocity.current = reduced ? 0 : Math.max(-6, Math.min(6, g.v))
      root.current.dataset.justDragged = '1'
      setTimeout(() => { if (root.current) delete root.current.dataset.justDragged }, 0)
    }
    tick()
  }

  if (!n) return null
  const center = wrap(base, n)
  const active = items[center]

  return (
    <section
      ref={root}
      className={`c3d ${variant === 'hero' ? 'c3d--hero' : ''}`}
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false) }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
      }}
    >
      <div
        className="c3d__stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => { if (root.current?.dataset.justDragged) { e.preventDefault(); e.stopPropagation() } }}
      >
        {SLOTS.map((slot, s) => {
          const item = items[wrap(base + slot, n)]
          const isCenter = slot === 0
          return (
            <div key={slot} ref={(el) => (cards.current[s] = el)} className="c3d__card" aria-hidden={isCenter ? undefined : 'true'}>
              <Link to={item.href} tabIndex={isCenter ? 0 : -1} draggable={false} aria-label={isCenter ? `Open ${item.title}` : undefined}>
                <MediaSlot media={{ ...item.media, alt: '', caption: '' }} ratio="var(--cover-ratio)" label="Project cover" />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="c3d__bar">
        <p className="c3d__caption" aria-hidden="true">
          <span className="c3d__count">{String(center + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          {variant !== 'hero' && <span className={`c3d__title ${active.scaffold ? 'is-draft' : ''}`}>{active.title}</span>}
        </p>
        <div className="c3d__controls">
          <button type="button" onClick={() => go(-1)} aria-label="Previous project">←</button>
          {autoplay && n > 1 && !reduced && (
            <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? 'Play carousel' : 'Pause carousel'}>
              {paused ? 'Play' : 'Pause'}
            </button>
          )}
          <button type="button" onClick={() => go(1)} aria-label="Next project">→</button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{announce}</p>
    </section>
  )
}
