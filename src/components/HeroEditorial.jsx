import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MediaSlot } from './bits'

// Landing hero, "editorial" version: a dark navy panel with the statement set in three voices
// (script italic, serif, sans), call-to-action buttons, a row of facts and a lit project visual.
// Layout idea from an owner-supplied product landing reference; content is the owner's own
// (statement, About facts, project covers) and the colours derive from this site's blues.
const ROTATE_MS = 4500

export default function HeroEditorial({ identity, about, projects }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (projects.length < 2 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % projects.length), ROTATE_MS)
    return () => clearInterval(t)
  }, [projects.length, paused])

  // "Solving problems through design." → Solving / problems through / design.
  const words = `${identity.statement.lead} ${identity.statement.emphasis || ''}`.trim().split(/\s+/)
  const [head, tail] = [words[0], words.length > 2 ? words[words.length - 1] : '']
  const middle = words.slice(1, tail ? -1 : undefined).join(' ')

  const edu = about.education.find((e) => !e.hidden)
  const exp = about.experience.find((e) => !e.hidden)
  const facts = [
    projects.length > 0 && { big: String(projects.length), small: 'Case studies' },
    edu && { big: edu.detail.split(' · ')[0].split(' ')[0], small: `${edu.detail.split(' · ')[0].split(' ').slice(1).join(' ')} · ${edu.title.split(' (')[0]}` },
    exp && { big: exp.org, small: exp.role },
  ].filter(Boolean)

  const current = projects[i]

  return (
    <section className="hero-e" aria-label="Introduction">
      <div className="hero-e__panel">
        <div className="hero-e__copy">
          <p className="hero-e__meta">{identity.name}<br />{identity.discipline}</p>
          <h1 className="hero-e__title">
            <span className="line"><span className="hero-e__script">{head}</span></span>
            {middle && <span className="line"><span className="hero-e__serif">{middle}</span></span>}
            {tail && <span className="line"><span className="hero-e__sans">{tail}</span></span>}
          </h1>
          <div className="hero-e__actions">
            <a href="#selected" className="hero-e__pill">View my work</a>
            <Link to="/about" className="hero-e__round">
              <span className="hero-e__roundIcon" aria-hidden="true">→</span>
              <span>About<br />me</span>
            </Link>
          </div>
          {facts.length > 0 && (
            <dl className="hero-e__facts">
              {facts.map((f) => (
                <div key={f.small}><dt>{f.big}</dt><dd>{f.small}</dd></div>
              ))}
            </dl>
          )}
        </div>

        {current && (
          <div className="hero-e__visual" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
            <div className="hero-e__glow" aria-hidden="true" />
            {projects.map((p, n) => (
              <Link key={p.id} to={`/work/${p.slug}`} className={`hero-e__shot ${n === i ? 'is-on' : ''}`} tabIndex={n === i ? 0 : -1} aria-hidden={n !== i} aria-label={`${p.title} — case study`}>
                {p.cover?.src
                  ? <img src={p.cover.src} alt="" decoding="async" loading={n === 0 ? 'eager' : 'lazy'} />
                  : <MediaSlot media={p.cover} ratio="16 / 10" label="Project cover" />}
              </Link>
            ))}
            <p className="hero-e__caption" aria-live="polite"><span>Selected work</span>{current.title}</p>
          </div>
        )}
      </div>
    </section>
  )
}
