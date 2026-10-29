import { Link } from 'react-router-dom'

// Landing hero, "editorial" version: full-bleed black lit with midnight blue, running under the nav and
// fading into the page background at the bottom so it flows into the rest of the site. The owner's name
// as the headline (both words Playfair italic), the statement, one quiet line of credentials and the
// site's own text links. The heart lives in the opening animation (HeartIntro) only.
export default function HeroEditorial({ identity, about }) {
  const [first, ...rest] = identity.name.split(' ')
  const statement = `${identity.statement.lead} ${identity.statement.emphasis || ''}`.trim()

  const edu = about.education.find((e) => !e.hidden)
  const exp = about.experience.find((e) => !e.hidden)
  const note = [
    edu && `${edu.detail.split(' · ')[0]}, ${edu.title.split(' (')[0]}`,
    exp && `${exp.role}, ${exp.org} (${exp.dates})`,
  ].filter(Boolean)

  return (
    <section className="hero-e" aria-label="Introduction">
      <div className="hero-e__inner wrap">
        <p className="hero-e__meta">{identity.discipline}</p>
        <h1 className="hero-e__title" aria-label={identity.name}>
          <span className="line"><span className="hero-e__first">{first}</span></span>
          {rest.length > 0 && <span className="line"><span className="hero-e__last">{rest.join(' ')}</span></span>}
        </h1>
        <p className="hero-e__statement">{statement}</p>
        {note.length > 0 && <p className="hero-e__note">{note.join(' · ')}</p>}
        <div className="hero-e__links">
          <a href="#selected" className="textlink">Selected work <span aria-hidden="true">↓</span></a>
          <Link to="/about" className="textlink">About me <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  )
}
