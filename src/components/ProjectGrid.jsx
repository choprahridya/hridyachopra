import { Link } from 'react-router-dom'
import { Reveal, MediaSlot } from './bits'

// Grid of project cards: whole cover (never cropped), title, one-line summary, then "View →" with tags.
// Card format adapted from a reference work page (pramitranjan-portfolio.vercel.app/work); colours and type are this site's.
export default function ProjectGrid({ projects }) {
  return (
    <ul className="pgrid">
      {projects.map((p, i) => (
        <Reveal as="li" key={p.id} delay={i * 70}>
          <Link to={`/work/${p.slug}`} className="pcard">
            <div className="pcard__media">
              <MediaSlot media={{ ...p.cover, alt: '', caption: '', fit: 'contain' }} ratio="16 / 10" label="Project cover" />
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
