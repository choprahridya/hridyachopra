import { Link } from 'react-router-dom'
import Flower from './Flower'

// Landing hero, "editorial" version: a black panel lit with midnight blue, the owner's name as the
// headline (both words Playfair italic), the statement beneath, call-to-action buttons, a row of facts
// and a large blue bloom on the right. Layout idea from an owner-supplied product landing reference;
// content is the owner's own and the colours derive from this site's blues.
export default function HeroEditorial({ identity, about, projectCount }) {
  const [first, ...rest] = identity.name.split(' ')
  const statement = `${identity.statement.lead} ${identity.statement.emphasis || ''}`.trim()

  const edu = about.education.find((e) => !e.hidden)
  const exp = about.experience.find((e) => !e.hidden)
  const degree = edu?.detail.split(' · ')[0].split(' ') || []
  const facts = [
    projectCount > 0 && { big: String(projectCount), small: 'Case studies' },
    edu && { big: degree[0], small: `${degree.slice(1).join(' ')} · ${edu.title.split(' (')[0]}` },
    exp && { big: exp.org, small: exp.role },
  ].filter(Boolean)

  // Pointer position over the panel (-1..1) drives the bloom's depth layers (see .flower__layer).
  const tilt = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
    e.currentTarget.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
  }

  return (
    <section className="hero-e" aria-label="Introduction">
      <div className="hero-e__panel" onPointerMove={tilt} onPointerLeave={(e) => { e.currentTarget.style.setProperty('--mx', 0); e.currentTarget.style.setProperty('--my', 0) }}>
        <Flower className="hero-e__flower" />
        <div className="hero-e__copy">
          <p className="hero-e__meta">{identity.discipline}{edu && <><br />{edu.title.split(' (')[0]}</>}</p>
          <h1 className="hero-e__title" aria-label={identity.name}>
            <span className="line"><span className="hero-e__script">{first}</span></span>
            {rest.length > 0 && <span className="line"><span className="hero-e__serif">{rest.join(' ')}</span></span>}
          </h1>
          <p className="hero-e__statement">{statement}</p>
          <div className="hero-e__actions">
            <Link to="/work" className="hero-e__pill">View my work</Link>
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
      </div>
    </section>
  )
}
