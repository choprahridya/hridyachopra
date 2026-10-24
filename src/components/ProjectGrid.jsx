import { Link } from 'react-router-dom'
import { Reveal, MediaSlot } from './bits'

// Grid of project cards: whole cover (never cropped), title, one-line summary, then "View →" with tags.
// Card format adapted from a reference work page (pramitranjan-portfolio.vercel.app/work); colours and type are this site's.
// Hover / keyboard focus (from the owner's earlier site): the card lifts with an accent border, an optional
// second image fades in, and a dark gradient reveals tags, the summary and "View case study →".
export default function ProjectGrid({ projects }) {
  return (
    <ul className="pgrid">
      {projects.map((p, i) => (
        <Reveal as="li" key={p.id} delay={i * 70}>
          <Link to={`/work/${p.slug}`} className="pcard">
            <div className="pcard__media">
              <MediaSlot media={{ ...p.cover, alt: '', caption: '', fit: 'contain' }} ratio="16 / 10" label="Project cover" />
              {p.cardHover?.src && (
                <img className="pcard__hoverImg" src={p.cardHover.src} alt="" loading="lazy" decoding="async" />
              )}
              <div className="pcard__overlay" aria-hidden="true">
                <div className="pcard__chips">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                <p className="pcard__overlaySum">{p.summary}</p>
                <span className="pcard__overlayCta">View case study <span>→</span></span>
              </div>
            </div>
            <h3 className={`pcard__title ${p.scaffold ? 'is-draft' : ''}`}>{p.title}</h3>
            <p className={`pcard__sum ${p.scaffold ? 'is-draft' : ''}`}>{p.summary}</p>
            <div className="pcard__foot">
              <span className="pcard__view">View <span aria-hidden="true">→</span></span>
              <span className="pcard__tags">{p.tags.join(' · ')}</span>
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
  )
}
