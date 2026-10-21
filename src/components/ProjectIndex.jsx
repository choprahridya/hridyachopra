import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, MediaSlot } from './bits'

// Numbered index of projects. On pointer devices the cover floats beside
// the cursor while hovering a row; on touch (or the "inline" variant) it sits under the title.
export default function ProjectIndex({ projects }) {
  const listRef = useRef(null)
  const [active, setActive] = useState(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMove = (e) => {
    const r = listRef.current.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <div className="index" ref={listRef} onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      {projects.map((p, i) => (
        <Reveal key={p.id} delay={i * 90}>
          <Link
            to={`/work/${p.slug}`}
            className="index__row"
            onPointerEnter={() => setActive(p.id)}
            onFocus={() => setActive(null)}
          >
            <span className="index__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="index__main">
              <span className={`index__title ${p.scaffold ? 'is-draft' : ''}`}>{p.title}</span>
              <span className={`index__sum ${p.scaffold ? 'is-draft' : ''}`}>{p.summary}</span>
            </span>
            <span className="index__tags">{p.tags.join(' · ')}</span>
            <span className="index__arrow" aria-hidden="true">→</span>
            <MediaSlot className="index__inline cover" media={{ ...p.cover, alt: '' }} ratio="var(--cover-ratio)" label="Project cover" />
          </Link>
        </Reveal>
      ))}
      <div
        className={`index__float ${active ? 'is-on' : ''}`}
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
        aria-hidden="true"
      >
        {projects.map((p) => (
          <div key={p.id} className={`index__floatItem ${active === p.id ? 'is-on' : ''}`}>
            <MediaSlot className="cover" media={{ ...p.cover, alt: '', caption: '' }} ratio="var(--cover-ratio)" label="Cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
